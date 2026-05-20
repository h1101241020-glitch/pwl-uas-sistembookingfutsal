// src/routes/operatingHours.ts
import { Elysia } from "elysia";
import { prisma } from "../utils/prisma";
import { successResponse, errorResponse } from "../utils/response";
import { bulkOperatingHoursSchema } from "../utils/validation";
import { authMiddleware, ownerOnly } from "../middleware/auth";

export const operatingHourRoutes = new Elysia({ prefix: "/operating-hours" })

  // ── GET /operating-hours/:venueId — Jam operasional venue (publik)
  .get(
    "/:venueId",
    async ({ params: { venueId }, set }) => {
      const venue = await prisma.venue.findUnique({ where: { id: venueId } });
      if (!venue) {
        set.status = 404;
        return errorResponse("Venue tidak ditemukan");
      }

      const hours = await prisma.operatingHour.findMany({
        where: { venueId },
        orderBy: { dayOfWeek: "asc" },
      });

      return successResponse(hours, "Jam operasional berhasil diambil");
    },
    { detail: { tags: ["Operating Hours"], summary: "Jam operasional venue (publik)" } }
  )

  .use(authMiddleware)

  // ── PUT /operating-hours/:venueId — Set jam operasional (bulk, owner only)
  .put(
    "/:venueId",
    async ({ params: { venueId }, body, user, set }) => {
      ownerOnly(user, set);

      // Cek kepemilikan venue
      const venue = await prisma.venue.findFirst({
        where: { id: venueId, ownerId: user.userId },
      });

      if (!venue) {
        set.status = 404;
        return errorResponse("Venue tidak ditemukan atau bukan milik Anda");
      }

      const parsed = bulkOperatingHoursSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 422;
        return errorResponse("Validasi gagal", parsed.error.flatten().fieldErrors);
      }

      // Upsert semua hari sekaligus
      const results = await Promise.all(
        parsed.data.hours.map(async ({ dayOfWeek, openTime, closeTime }) => {
          const [oh, om] = openTime.split(":").map(Number);
          const [ch, cm] = closeTime.split(":").map(Number);
          const base = new Date("1970-01-01");
          const openDate = new Date(base);
          openDate.setHours(oh, om, 0, 0);
          const closeDate = new Date(base);
          closeDate.setHours(ch, cm, 0, 0);

          return prisma.operatingHour.upsert({
            where: { unique_venue_day: { venueId, dayOfWeek } },
            create: { venueId, dayOfWeek, openTime: openDate, closeTime: closeDate },
            update: { openTime: openDate, closeTime: closeDate },
          });
        })
      );

      return successResponse(results, "Jam operasional berhasil disimpan");
    },
    { detail: { tags: ["Operating Hours"], summary: "Set jam operasional venue (owner)" } }
  );
