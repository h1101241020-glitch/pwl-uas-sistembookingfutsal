// src/routes/venues.ts
import { Elysia } from "elysia";
import { prisma } from "../utils/prisma";
import { successResponse, errorResponse, paginatedResponse } from "../utils/response";
import { createVenueSchema, updateVenueSchema, venueFilterSchema } from "../utils/validation";
import { authMiddleware, ownerOnly } from "../middleware/auth";

export const venueRoutes = new Elysia({ prefix: "/venues" })

  // ── GET /venues — Publik, list semua venue dengan filter ──
  .get(
    "/",
    async ({ query }) => {
      const parsed = venueFilterSchema.safeParse(query);
      if (!parsed.success) {
        return errorResponse("Parameter tidak valid", parsed.error.flatten().fieldErrors);
      }

      const { page, limit, city, surfaceType, minPrice, maxPrice, search } = parsed.data;
      const skip = (page - 1) * limit;

      const where: any = { isActive: true };
      if (city) where.city = { contains: city, mode: "insensitive" };
      if (search) where.name = { contains: search, mode: "insensitive" };
      if (surfaceType || minPrice || maxPrice) {
        where.fields = {
          some: {
            isActive: true,
            ...(surfaceType ? { surfaceType } : {}),
            ...(minPrice || maxPrice
              ? {
                  pricePerHour: {
                    ...(minPrice ? { gte: minPrice } : {}),
                    ...(maxPrice ? { lte: maxPrice } : {}),
                  },
                }
              : {}),
          },
        };
      }

      const [venues, total] = await Promise.all([
        prisma.venue.findMany({
          where,
          skip,
          take: limit,
          include: {
            owner: { select: { id: true, name: true, phone: true } },
            fields: {
              where: { isActive: true },
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
            operatingHours: { orderBy: { dayOfWeek: "asc" } },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.venue.count({ where }),
      ]);

      return paginatedResponse(venues, total, page, limit, "Daftar venue berhasil diambil");
    },
    { detail: { tags: ["Venues"], summary: "List semua venue (publik)" } }
  )

  // ── GET /venues/:id — Publik, detail satu venue ───────
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      const venue = await prisma.venue.findUnique({
        where: { id, isActive: true },
        include: {
          owner: { select: { id: true, name: true, phone: true } },
          fields: {
            where: { isActive: true },
            include: { images: true },
          },
          operatingHours: { orderBy: { dayOfWeek: "asc" } },
        },
      });

      if (!venue) {
        set.status = 404;
        return errorResponse("Venue tidak ditemukan");
      }

      return successResponse(venue, "Detail venue berhasil diambil");
    },
    { detail: { tags: ["Venues"], summary: "Detail venue (publik)" } }
  )

  // ── Route di bawah ini butuh autentikasi ──────────────
  .use(authMiddleware)

  // ── POST /venues — Buat venue baru (owner only) ───────
  .post(
    "/",
    async ({ body, user, set }) => {
      ownerOnly(user, set);

      const parsed = createVenueSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 422;
        return errorResponse("Validasi gagal", parsed.error.flatten().fieldErrors);
      }

      const venue = await prisma.venue.create({
        data: { ...parsed.data, ownerId: user.userId },
      });

      set.status = 201;
      return successResponse(venue, "Venue berhasil dibuat");
    },
    { detail: { tags: ["Venues"], summary: "Buat venue baru (owner)" } }
  )

  // ── PATCH /venues/:id — Update venue (owner only) ─────
  .patch(
    "/:id",
    async ({ params: { id }, body, user, set }) => {
      ownerOnly(user, set);

      const venue = await prisma.venue.findFirst({
        where: { id, ownerId: user.userId },
      });

      if (!venue) {
        set.status = 404;
        return errorResponse("Venue tidak ditemukan atau bukan milik Anda");
      }

      const parsed = updateVenueSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 422;
        return errorResponse("Validasi gagal", parsed.error.flatten().fieldErrors);
      }

      const updated = await prisma.venue.update({
        where: { id },
        data: parsed.data,
      });

      return successResponse(updated, "Venue berhasil diperbarui");
    },
    { detail: { tags: ["Venues"], summary: "Update venue (owner)" } }
  )

  // ── DELETE /venues/:id — Nonaktifkan venue (owner only)
  .delete(
    "/:id",
    async ({ params: { id }, user, set }) => {
      ownerOnly(user, set);

      const venue = await prisma.venue.findFirst({
        where: { id, ownerId: user.userId },
      });

      if (!venue) {
        set.status = 404;
        return errorResponse("Venue tidak ditemukan atau bukan milik Anda");
      }

      // Soft delete — set isActive = false
      await prisma.venue.update({ where: { id }, data: { isActive: false } });

      return successResponse(null, "Venue berhasil dinonaktifkan");
    },
    { detail: { tags: ["Venues"], summary: "Nonaktifkan venue (owner)" } }
  )

  // ── GET /venues/owner/my — Venue milik owner yg login ─
  .get(
    "/owner/my",
    async ({ user, set }) => {
      ownerOnly(user, set);

      const venues = await prisma.venue.findMany({
        where: { ownerId: user.userId },
        include: {
          fields: { include: { images: { where: { isPrimary: true }, take: 1 } } },
          operatingHours: true,
          _count: { select: { fields: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return successResponse(venues, "Daftar venue Anda berhasil diambil");
    },
    { detail: { tags: ["Venues"], summary: "Daftar venue milik owner yang login" } }
  );
