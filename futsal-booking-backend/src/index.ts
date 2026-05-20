// src/index.ts
// Entry point — Website Booking Lapangan Futsal Online

import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

import { authRoutes } from "./routes/auth";
import { venueRoutes } from "./routes/venues";
import { fieldRoutes } from "./routes/fields";
import { bookingRoutes } from "./routes/bookings";
import { operatingHourRoutes } from "./routes/operatingHours";
import { errorResponse } from "./utils/response";

const PORT = parseInt(process.env.PORT || "3001");

const app = new Elysia()

  // ── CORS ──────────────────────────────────────────────
  .use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  )

  // ── Swagger Docs ──────────────────────────────────────
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "Futsal Booking API",
          version: "1.0.0",
          description:
            "REST API untuk platform booking lapangan futsal online — Kota Pontianak, Kalimantan Barat",
          contact: { name: "System Analyst" },
        },
        tags: [
          { name: "Auth", description: "Registrasi, login, dan profil pengguna" },
          { name: "Venues", description: "Manajemen venue / tempat futsal" },
          { name: "Fields", description: "Manajemen lapangan dalam venue" },
          { name: "Bookings", description: "Sistem booking dan jadwal" },
          { name: "Operating Hours", description: "Jam operasional venue" },
        ],
        components: {
          securitySchemes: {
            BearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
    })
  )

  // ── Health check ──────────────────────────────────────
  .get("/", () => ({
    status: "ok",
    message: "Futsal Booking API berjalan ✅",
    version: "1.0.0",
    docs: "/docs",
    timestamp: new Date().toISOString(),
  }))

  .get("/health", () => ({ status: "healthy", uptime: process.uptime() }))

  // ── Routes ────────────────────────────────────────────
  .group("/api/v1", (app) =>
    app
      .use(authRoutes)
      .use(venueRoutes)
      .use(fieldRoutes)
      .use(bookingRoutes)
      .use(operatingHourRoutes)
  )

  // ── Global error handler ──────────────────────────────
  .onError(({ code, error, set }) => {
    console.error(`[${code}]`, error);

    if (code === "NOT_FOUND") {
      set.status = 404;
      return errorResponse("Endpoint tidak ditemukan");
    }

    if (code === "VALIDATION") {
      set.status = 422;
      return errorResponse("Data tidak valid", error.message);
    }

    set.status = 500;
    return errorResponse("Terjadi kesalahan pada server. Silakan coba lagi.");
  })

  .listen(PORT);

console.log(`
🚀 Futsal Booking API aktif!
   URL     → http://localhost:${PORT}
   Docs    → http://localhost:${PORT}/docs
   Env     → ${process.env.NODE_ENV || "development"}
`);

export type App = typeof app;
