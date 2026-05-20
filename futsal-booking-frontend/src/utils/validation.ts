import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(9, 'Nomor HP tidak valid').max(15),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  role: z.enum(['player', 'owner']),
})

export const venueSchema = z.object({
  name: z.string().min(3, 'Nama venue minimal 3 karakter'),
  address: z.string().min(10, 'Alamat terlalu pendek'),
  city: z.string().min(2),
  description: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

export const fieldSchema = z.object({
  name: z.string().min(2, 'Nama lapangan minimal 2 karakter'),
  surfaceType: z.enum(['vinyl', 'grass', 'parquet']),
  pricePerHour: z.number().min(10000, 'Harga minimum Rp 10.000'),
})

export const bookingSchema = z.object({
  fieldId: z.string().uuid(),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal salah'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format jam salah'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format jam salah'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type VenueInput = z.infer<typeof venueSchema>
export type FieldInput = z.infer<typeof fieldSchema>
export type BookingInput = z.infer<typeof bookingSchema>
