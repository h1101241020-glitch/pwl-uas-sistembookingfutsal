// src/types/index.ts

export interface JWTPayload {
  userId: string;
  email: string;
  role: "player" | "owner";
  iat?: number;
  exp?: number;
}

export interface AuthContext {
  user: JWTPayload;
}

export interface SlotInfo {
  startTime: string;   // "HH:MM"
  endTime: string;     // "HH:MM"
  isAvailable: boolean;
}

export interface RevenueReport {
  period: string;
  totalBookings: number;
  totalRevenue: number;
  bookings: unknown[];
}
