// src/routes/bookings.ts
import { Elysia } from "elysia";
import { prisma } from "../utils/prisma";
import { successResponse, errorResponse, paginatedResponse } from "../utils/response";
import { createBookingSchema, bookingFilterSchema } from "../utils/validation";
import { authMiddleware, ownerOnly } from "../middleware/auth";

export const bookingRoutes = new Elysia({ prefix: "/bookings" })
  .use(authMiddleware)

  // ── POST /bookings — Buat booking baru (player only) ──
  .post(
    "/",
    async ({ body, user, set }) => {
      if (user.role !== "player") {
        set.status = 403;
        return errorResponse("Hanya pemain yang bisa melakukan booking");
      }

      const parsed = createBookingSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 422;
        return errorResponse("Validasi gagal", parsed.error.flatten().fieldErrors);
      }

      const { fieldId, bookingDate, startTime, endTime } = parsed.data;

      // Ambil data lapangan
      const field = await prisma.field.findFirst({
        where: { id: fieldId, isActive: true },
        include: {
          venue: { include: { operatingHours: true } },
        },
      });

      if (!field) {
        set.status = 404;
        return errorResponse("Lapangan tidak ditemukan atau tidak aktif");
      }

      // Validasi tanggal tidak di masa lalu
      const targetDate = new Date(bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (targetDate < today) {
        set.status = 400;
        return errorResponse("Tanggal booking tidak boleh di masa lalu");
      }

      // Cek jam operasional
      const dayOfWeek = targetDate.getDay();
      const opHour = field.venue.operatingHours.find((oh) => oh.dayOfWeek === dayOfWeek);
      if (!opHour) {
        set.status = 400;
        return errorResponse("Venue tutup pada hari yang dipilih");
      }

      const [startH] = startTime.split(":").map(Number);
      const [endH] = endTime.split(":").map(Number);
      const openH = opHour.openTime.getHours();
      const closeH = opHour.closeTime.getHours();

      if (startH < openH || endH > closeH || startH >= endH) {
        set.status = 400;
        return errorResponse(`Jam booking di luar jam operasional (${openH}:00–${closeH}:00)`);
      }

      // ── Lapis 1: Cek double booking via query ─────────
      const baseDate = new Date("1970-01-01");
      const startTimeDate = new Date(new Date("1970-01-01").setHours(startH, 0, 0, 0));
      const endTimeDate = new Date(new Date("1970-01-01").setHours(endH, 0, 0, 0));

      const conflict = await prisma.booking.findFirst({
        where: {
          fieldId,
          bookingDate: targetDate,
          status: { in: ["pending", "confirmed"] },
          // Overlap: startTime < endTime_baru AND endTime > startTime_baru
          startTime: { lt: endTimeDate },
          endTime: { gt: startTimeDate },
        },
      });

      if (conflict) {
        set.status = 409;
        return errorResponse("Slot waktu yang dipilih sudah dipesan. Silakan pilih waktu lain.");
      }

      // Hitung total harga
      const durationHours = endH - startH;
      const totalPrice = durationHours * field.pricePerHour;

      // Buat booking
      try {
        const booking = await prisma.booking.create({
          data: {
            fieldId,
            userId: user.userId,
            bookingDate: targetDate,
            startTime: startTimeDate,
            endTime: endTimeDate,
            totalPrice,
            status: "confirmed", // Auto-confirm di MVP (tanpa pembayaran)
          },
          include: {
            field: {
              include: {
                venue: { select: { name: true, address: true } },
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        });

        set.status = 201;
        return successResponse(booking, "Booking berhasil dibuat");
      } catch (error: any) {
        // ── Lapis 2: Tangkap unique constraint violation ──
        if (error.code === "P2002") {
          set.status = 409;
          return errorResponse("Slot waktu yang dipilih sudah dipesan (conflict terdeteksi oleh database).");
        }
        throw error;
      }
    },
    { detail: { tags: ["Bookings"], summary: "Buat booking baru (player)" } }
  )

  // ── GET /bookings/my — Riwayat booking pemain ─────────
  .get(
    "/my",
    async ({ user, query }) => {
      const parsed = bookingFilterSchema.safeParse(query);
      if (!parsed.success) {
        return errorResponse("Parameter tidak valid");
      }

      const { page, limit, status, startDate, endDate } = parsed.data;
      const skip = (page - 1) * limit;

      const where: any = { userId: user.userId };
      if (status) where.status = status;
      if (startDate) where.bookingDate = { gte: new Date(startDate) };
      if (endDate) where.bookingDate = { ...where.bookingDate, lte: new Date(endDate) };

      const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
          where,
          skip,
          take: limit,
          include: {
            field: {
              include: {
                venue: { select: { id: true, name: true, address: true } },
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.booking.count({ where }),
      ]);

      return paginatedResponse(bookings, total, page, limit, "Riwayat booking berhasil diambil");
    },
    { detail: { tags: ["Bookings"], summary: "Riwayat booking pemain yang login" } }
  )

  // ── GET /bookings/:id — Detail booking ───────────────
  .get(
    "/:id",
    async ({ params: { id }, user, set }) => {
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          field: {
            include: {
              venue: true,
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
      });

      if (!booking) {
        set.status = 404;
        return errorResponse("Booking tidak ditemukan");
      }

      // Player hanya bisa lihat booking sendiri; owner bisa lihat booking di venue miliknya
      const isOwner = user.role === "owner" && booking.field.venue.ownerId === user.userId;
      const isPlayer = booking.userId === user.userId;

      if (!isOwner && !isPlayer) {
        set.status = 403;
        return errorResponse("Akses ditolak");
      }

      return successResponse(booking, "Detail booking berhasil diambil");
    },
    { detail: { tags: ["Bookings"], summary: "Detail booking" } }
  )

  // ── PATCH /bookings/:id/cancel — Batalkan booking ─────
  .patch(
    "/:id/cancel",
    async ({ params: { id }, user, set }) => {
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: { field: { include: { venue: true } } },
      });

      if (!booking) {
        set.status = 404;
        return errorResponse("Booking tidak ditemukan");
      }

      // Hanya player pemilik booking yang bisa batalkan
      if (booking.userId !== user.userId) {
        set.status = 403;
        return errorResponse("Anda tidak berhak membatalkan booking ini");
      }

      if (booking.status !== "pending" && booking.status !== "confirmed") {
        set.status = 400;
        return errorResponse("Booking yang sudah dibatalkan tidak bisa dibatalkan lagi");
      }

      const updated = await prisma.booking.update({
        where: { id },
        data: { status: "cancelled" },
      });

      return successResponse(updated, "Booking berhasil dibatalkan");
    },
    { detail: { tags: ["Bookings"], summary: "Batalkan booking (player)" } }
  )

  // ── GET /bookings/owner/incoming — Booking masuk ke venue owner
  .get(
    "/owner/incoming",
    async ({ user, query, set }) => {
      ownerOnly(user, set);

      const parsed = bookingFilterSchema.safeParse(query);
      if (!parsed.success) {
        return errorResponse("Parameter tidak valid");
      }

      const { page, limit, status, fieldId, startDate, endDate } = parsed.data;
      const skip = (page - 1) * limit;

      // Ambil semua field milik owner
      const ownerVenues = await prisma.venue.findMany({
        where: { ownerId: user.userId },
        select: { id: true },
      });
      const venueIds = ownerVenues.map((v) => v.id);

      const where: any = {
        field: { venueId: { in: venueIds } },
      };
      if (status) where.status = status;
      if (fieldId) where.fieldId = fieldId;
      if (startDate) where.bookingDate = { gte: new Date(startDate) };
      if (endDate) where.bookingDate = { ...where.bookingDate, lte: new Date(endDate) };

      const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
          where,
          skip,
          take: limit,
          include: {
            field: { include: { venue: { select: { name: true } } } },
            user: { select: { id: true, name: true, phone: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.booking.count({ where }),
      ]);

      return paginatedResponse(bookings, total, page, limit, "Daftar booking masuk berhasil diambil");
    },
    { detail: { tags: ["Bookings"], summary: "Booking masuk ke venue owner" } }
  )

  // ── GET /bookings/owner/revenue — Laporan pendapatan ──
  .get(
    "/owner/revenue",
    async ({ user, query, set }) => {
      ownerOnly(user, set);

      const { period = "month", year, month } = query as {
        period?: "week" | "month";
        year?: string;
        month?: string;
      };

      const ownerVenues = await prisma.venue.findMany({
        where: { ownerId: user.userId },
        select: { id: true },
      });
      const venueIds = ownerVenues.map((v) => v.id);

      const now = new Date();
      const targetYear = year ? parseInt(year) : now.getFullYear();
      const targetMonth = month ? parseInt(month) - 1 : now.getMonth();

      let startDate: Date;
      let endDate: Date;

      if (period === "week") {
        const day = now.getDay();
        startDate = new Date(now);
        startDate.setDate(now.getDate() - day);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
      } else {
        startDate = new Date(targetYear, targetMonth, 1);
        endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);
      }

      const bookings = await prisma.booking.findMany({
        where: {
          field: { venueId: { in: venueIds } },
          status: "confirmed",
          bookingDate: { gte: startDate, lte: endDate },
        },
        include: {
          field: { select: { name: true, venue: { select: { name: true } } } },
          user: { select: { name: true } },
        },
        orderBy: { bookingDate: "asc" },
      });

      const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

      return successResponse(
        {
          period,
          startDate,
          endDate,
          totalBookings: bookings.length,
          totalRevenue,
          bookings,
        },
        "Laporan pendapatan berhasil diambil"
      );
    },
    { detail: { tags: ["Bookings"], summary: "Laporan pendapatan owner" } }
  );
