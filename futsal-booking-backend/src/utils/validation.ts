// src/utils/validation.ts
import { z } from "zod";

// ── Auth ──────────────────────────────────────────────
export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(10, "Nomor HP minimal 10 digit").max(20).optional(),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["player", "owner"]),
});

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

// ── Venue ─────────────────────────────────────────────
export const createVenueSchema = z.object({
  name: z.string().min(3).max(150),
  description: z.string().optional(),
  address: z.string().min(5).max(255),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  city: z.string().default("Pontianak"),
});

export const updateVenueSchema = createVenueSchema.partial();

// ── Field ─────────────────────────────────────────────
export const createFieldSchema = z.object({
  venueId: z.string().uuid("venueId harus UUID"),
  name: z.string().min(1).max(100),
  surfaceType: z.enum(["vinyl", "grass", "parquet"]),
  pricePerHour: z.number().int().positive("Harga harus bilangan positif"),
});

export const updateFieldSchema = createFieldSchema.partial().omit({ venueId: true });

// ── Operating Hours ───────────────────────────────────
export const operatingHourSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  openTime: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM"),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM"),
});

export const bulkOperatingHoursSchema = z.object({
  hours: z.array(operatingHourSchema).min(1).max(7),
});

// ── Booking ───────────────────────────────────────────
export const createBookingSchema = z.object({
  fieldId: z.string().uuid(),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM"),
});

// ── Query params ──────────────────────────────────────
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const venueFilterSchema = paginationSchema.extend({
  city: z.string().optional(),
  surfaceType: z.enum(["vinyl", "grass", "parquet"]).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
});

export const bookingFilterSchema = paginationSchema.extend({
  status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
  fieldId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
