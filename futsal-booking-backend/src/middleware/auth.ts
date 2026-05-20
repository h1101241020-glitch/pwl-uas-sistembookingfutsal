// src/middleware/auth.ts
import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { errorResponse } from "../utils/response";
import type { JWTPayload } from "../types";

// Plugin autentikasi — dipakai di route yang butuh login
export const authMiddleware = new Elysia({ name: "auth-middleware" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "fallback-secret-ganti-di-production",
    })
  )
  .derive({ as: "scoped" }, async ({ jwt, headers, set }) => {
    const authorization = headers["authorization"];

    if (!authorization || !authorization.startsWith("Bearer ")) {
      set.status = 401;
      throw errorResponse("Token autentikasi diperlukan");
    }

    const token = authorization.split(" ")[1];

    try {
      const payload = await jwt.verify(token);
      if (!payload) {
        set.status = 401;
        throw errorResponse("Token tidak valid atau sudah kadaluarsa");
      }
      return { user: payload as unknown as JWTPayload };
    } catch {
      set.status = 401;
      throw errorResponse("Token tidak valid atau sudah kadaluarsa");
    }
  });

// Guard khusus pemilik lapangan
export const ownerOnly = (user: JWTPayload, set: { status: number }) => {
  if (user.role !== "owner") {
    set.status = 403;
    throw errorResponse("Akses ditolak. Fitur ini hanya untuk pemilik lapangan.");
  }
};

// Guard khusus pemain
export const playerOnly = (user: JWTPayload, set: { status: number }) => {
  if (user.role !== "player") {
    set.status = 403;
    throw errorResponse("Akses ditolak. Fitur ini hanya untuk pemain.");
  }
};
