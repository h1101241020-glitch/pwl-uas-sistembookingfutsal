// src/routes/fields.ts
import { Elysia } from "elysia";
import { prisma } from "../utils/prisma";
import { successResponse, errorResponse } from "../utils/response";
import { createFieldSchema, updateFieldSchema } from "../utils/validation";
import { authMiddleware, ownerOnly } from "../middleware/auth";
import { uploadImage } from "../utils/cloudinary";

export const fieldRoutes = new Elysia({ prefix: "/fields" })

  // ── GET /fields/:id — Detail lapangan (publik) ────────
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      const field = await prisma.field.findUnique({
        where: { id, isActive: true },
        include: {
          images: true,
          venue: {
            include: { operatingHours: { orderBy: { dayOfWeek: "asc" } } },
          },
        },
      });

      if (!field) {
        set.status = 404;
        return errorResponse("Lapangan tidak ditemukan");
      }

      return successResponse(field, "Detail lapangan berhasil diambil");
    },
    { detail: { tags: ["Fields"], summary: "Detail lapangan (publik)" } }
  )

  // ── GET /fields/:id/slots — Slot tersedia pada tanggal tertentu
  .get(
    "/:id/slots",
    async ({ params: { id }, query, set }) => {
      const { date } = query as { date?: string };

      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        set.status = 400;
        return errorResponse("Parameter 'date' wajib dalam format YYYY-MM-DD");
      }

      const field = await prisma.field.findUnique({
        where: { id, isActive: true },
        include: {
          venue: { include: { operatingHours: true } },
        },
      });

      if (!field) {
        set.status = 404;
        return errorResponse("Lapangan tidak ditemukan");
      }

      // Tentukan hari dalam seminggu (0=Minggu)
      const targetDate = new Date(date);
      const dayOfWeek = targetDate.getDay();

      const opHour = field.venue.operatingHours.find((oh) => oh.dayOfWeek === dayOfWeek);
      if (!opHour) {
        return successResponse([], `Lapangan tutup pada hari ini`);
      }

      // Ambil booking yang sudah ada di tanggal tersebut
      const existingBookings = await prisma.booking.findMany({
        where: {
          fieldId: id,
          bookingDate: targetDate,
          status: { in: ["pending", "confirmed"] },
        },
        select: { startTime: true, endTime: true },
      });

      // Generate slot per jam dari jam buka sampai tutup
      const openHour = opHour.openTime.getHours();
      const closeHour = opHour.closeTime.getHours();

      const slots = [];
      for (let hour = openHour; hour < closeHour; hour++) {
        const startTime = `${String(hour).padStart(2, "0")}:00`;
        const endTime = `${String(hour + 1).padStart(2, "0")}:00`;

        // Cek apakah slot ini sudah dibooking
        const isBooked = existingBookings.some((b) => {
          const bStart = b.startTime.getHours();
          const bEnd = b.endTime.getHours();
          return hour >= bStart && hour < bEnd;
        });

        slots.push({
          startTime,
          endTime,
          isAvailable: !isBooked,
          pricePerHour: field.pricePerHour,
        });
      }

      return successResponse(slots, `Slot lapangan pada ${date}`);
    },
    { detail: { tags: ["Fields"], summary: "Cek slot tersedia pada tanggal tertentu" } }
  )

  // ── Route di bawah butuh autentikasi ──────────────────
  .use(authMiddleware)

  // ── POST /fields — Tambah lapangan baru (owner only) ──
  .post(
    "/",
    async ({ body, user, set }) => {
      ownerOnly(user, set);

      const parsed = createFieldSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 422;
        return errorResponse("Validasi gagal", parsed.error.flatten().fieldErrors);
      }

      // Pastikan venue milik owner yang sedang login
      const venue = await prisma.venue.findFirst({
        where: { id: parsed.data.venueId, ownerId: user.userId },
      });

      if (!venue) {
        set.status = 403;
        return errorResponse("Venue tidak ditemukan atau bukan milik Anda");
      }

      const field = await prisma.field.create({
        data: parsed.data as any,
        include: { images: true },
      });

      set.status = 201;
      return successResponse(field, "Lapangan berhasil ditambahkan");
    },
    { detail: { tags: ["Fields"], summary: "Tambah lapangan baru (owner)" } }
  )

  // ── PATCH /fields/:id — Update lapangan (owner only) ──
  .patch(
    "/:id",
    async ({ params: { id }, body, user, set }) => {
      ownerOnly(user, set);

      // Cek kepemilikan
      const field = await prisma.field.findFirst({
        where: { id },
        include: { venue: true },
      });

      if (!field || field.venue.ownerId !== user.userId) {
        set.status = 404;
        return errorResponse("Lapangan tidak ditemukan atau bukan milik Anda");
      }

      const parsed = updateFieldSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 422;
        return errorResponse("Validasi gagal", parsed.error.flatten().fieldErrors);
      }

      const updated = await prisma.field.update({
        where: { id },
        data: parsed.data as any,
        include: { images: true },
      });

      return successResponse(updated, "Lapangan berhasil diperbarui");
    },
    { detail: { tags: ["Fields"], summary: "Update lapangan (owner)" } }
  )

  // ── POST /fields/:id/images — Upload foto lapangan ────
  .post(
    "/:id/images",
    async ({ params: { id }, body, user, set }) => {
      ownerOnly(user, set);

      const field = await prisma.field.findFirst({
        where: { id },
        include: { venue: true },
      });

      if (!field || field.venue.ownerId !== user.userId) {
        set.status = 404;
        return errorResponse("Lapangan tidak ditemukan atau bukan milik Anda");
      }

      const { imageUrl, isPrimary } = body as { imageUrl: string; isPrimary?: boolean };

      // Jika isPrimary = true, reset semua foto lain jadi false
      if (isPrimary) {
        await prisma.fieldImage.updateMany({
          where: { fieldId: id },
          data: { isPrimary: false },
        });
      }

      const image = await prisma.fieldImage.create({
        data: { fieldId: id, imageUrl, isPrimary: isPrimary ?? false },
      });

      set.status = 201;
      return successResponse(image, "Foto lapangan berhasil ditambahkan");
    },
    { detail: { tags: ["Fields"], summary: "Upload foto lapangan (owner)" } }
  )

  // ── DELETE /fields/:id — Nonaktifkan lapangan (owner) ─
  .delete(
    "/:id",
    async ({ params: { id }, user, set }) => {
      ownerOnly(user, set);

      const field = await prisma.field.findFirst({
        where: { id },
        include: { venue: true },
      });

      if (!field || field.venue.ownerId !== user.userId) {
        set.status = 404;
        return errorResponse("Lapangan tidak ditemukan atau bukan milik Anda");
      }

      await prisma.field.update({ where: { id }, data: { isActive: false } });

      return successResponse(null, "Lapangan berhasil dinonaktifkan");
    },
    { detail: { tags: ["Fields"], summary: "Nonaktifkan lapangan (owner)" } }
  );
