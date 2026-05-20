// src/routes/auth.ts
import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma";
import { successResponse, errorResponse } from "../utils/response";
import { registerSchema, loginSchema } from "../utils/validation";
import { authMiddleware } from "../middleware/auth";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "fallback-secret-ganti-di-production",
    })
  )

  // ── POST /auth/register ───────────────────────────────
  .post(
    "/register",
    async ({ body, set, jwt }) => {
      const parsed = registerSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 422;
        return errorResponse("Validasi gagal", parsed.error.flatten().fieldErrors);
      }

      const { name, email, phone, password, role } = parsed.data;

      // Cek email sudah terdaftar
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        set.status = 409;
        return errorResponse("Email sudah terdaftar");
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: { name, email, phone, passwordHash, role: role as any },
        select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      });

      const token = await jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      set.status = 201;
      return successResponse({ user, token }, "Registrasi berhasil");
    },
    { detail: { tags: ["Auth"], summary: "Registrasi pengguna baru" } }
  )

  // ── POST /auth/login ──────────────────────────────────
  .post(
    "/login",
    async ({ body, set, jwt }) => {
      const parsed = loginSchema.safeParse(body);
      if (!parsed.success) {
        set.status = 422;
        return errorResponse("Validasi gagal", parsed.error.flatten().fieldErrors);
      }

      const { email, password } = parsed.data;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        set.status = 401;
        return errorResponse("Email atau password salah");
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        set.status = 401;
        return errorResponse("Email atau password salah");
      }

      const token = await jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const { passwordHash: _, ...safeUser } = user;
      return successResponse({ user: safeUser, token }, "Login berhasil");
    },
    { detail: { tags: ["Auth"], summary: "Login pengguna" } }
  )

  // ── GET /auth/me ──────────────────────────────────────
  .use(authMiddleware)
  .get(
    "/me",
    async ({ user, set }) => {
      const profile = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      });

      if (!profile) {
        set.status = 404;
        return errorResponse("Pengguna tidak ditemukan");
      }

      return successResponse(profile, "Data profil berhasil diambil");
    },
    { detail: { tags: ["Auth"], summary: "Ambil data profil pengguna yang sedang login" } }
  )

  // ── PATCH /auth/me ────────────────────────────────────
  .patch(
    "/me",
    async ({ user, body, set }) => {
      const { name, phone } = body as { name?: string; phone?: string };

      const updated = await prisma.user.update({
        where: { id: user.userId },
        data: { name, phone },
        select: { id: true, name: true, email: true, phone: true, role: true },
      });

      return successResponse(updated, "Profil berhasil diperbarui");
    },
    { detail: { tags: ["Auth"], summary: "Update profil pengguna" } }
  );
