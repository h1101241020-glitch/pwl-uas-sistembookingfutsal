// ─── Auth & User ───────────────────────────────────────────────
export type Role = 'player' | 'owner'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: Role
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

// ─── Venue ────────────────────────────────────────────────────
export interface Venue {
  id: string
  ownerId: string
  name: string
  description?: string
  address: string
  latitude?: number
  longitude?: number
  city: string
  isActive: boolean
  createdAt: string
  fields?: Field[]
  operatingHours?: OperatingHour[]
}

// ─── Field ────────────────────────────────────────────────────
export type SurfaceType = 'vinyl' | 'grass' | 'parquet'

export interface Field {
  id: string
  venueId: string
  name: string
  surfaceType: SurfaceType
  pricePerHour: number
  isActive: boolean
  images?: FieldImage[]
  venue?: Venue
}

export interface FieldImage {
  id: string
  fieldId: string
  imageUrl: string
  isPrimary: boolean
}

// ─── Operating Hours ──────────────────────────────────────────
export interface OperatingHour {
  id: string
  venueId: string
  dayOfWeek: number
  openTime: string
  closeTime: string
}

// ─── Booking ──────────────────────────────────────────────────
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Booking {
  id: string
  fieldId: string
  userId: string
  bookingDate: string
  startTime: string
  endTime: string
  totalPrice: number
  status: BookingStatus
  createdAt: string
  field?: Field
  user?: User
}

// ─── API Response wrappers ────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// ─── Filters ──────────────────────────────────────────────────
export interface VenueFilters {
  city?: string
  surfaceType?: SurfaceType
  minPrice?: number
  maxPrice?: number
  date?: string
  search?: string
}
