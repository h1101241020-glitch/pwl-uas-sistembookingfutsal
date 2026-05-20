# 🏟️ Futsal Booking Backend

REST API untuk platform booking lapangan futsal online — **Kota Pontianak, Kalimantan Barat**

**Stack:** Elysia.js · Bun · TypeScript · PostgreSQL · Prisma ORM

---

## 🚀 Cara Mulai

### 1. Install dependencies
```bash
bun install
```

### 2. Setup database PostgreSQL lokal
Buat database baru di PostgreSQL:
```sql
CREATE DATABASE futsal_booking_db;
```

### 3. Konfigurasi environment
```bash
cp .env.example .env
# Edit .env — isi DATABASE_URL, JWT_SECRET, Cloudinary
```

### 4. Jalankan migrasi & generate Prisma client
```bash
bun db:generate    # Generate Prisma client
bun db:migrate     # Buat tabel di database
bun db:seed        # Isi data awal (opsional)
```

### 5. Jalankan server
```bash
bun dev     # Development (auto-reload)
bun start   # Production
```

Server aktif di **http://localhost:3001**

---

## 📖 Dokumentasi API

Buka **http://localhost:3001/docs** untuk Swagger UI interaktif.

---

## 🗂️ Struktur Folder

```
src/
├── index.ts              ← Entry point, setup Elysia + plugin
├── routes/
│   ├── auth.ts           ← Register, login, profil
│   ├── venues.ts         ← CRUD venue / tempat futsal
│   ├── fields.ts         ← CRUD lapangan + slot checker
│   ├── bookings.ts       ← Buat/batalkan booking, laporan
│   └── operatingHours.ts ← Jam operasional venue
├── middleware/
│   └── auth.ts           ← JWT guard, ownerOnly, playerOnly
├── utils/
│   ├── prisma.ts         ← Prisma client singleton
│   ├── response.ts       ← Format response konsisten
│   ├── validation.ts     ← Zod schemas
│   └── cloudinary.ts     ← Upload foto lapangan
└── types/
    └── index.ts          ← TypeScript interfaces
prisma/
├── schema.prisma         ← Definisi tabel & relasi
└── seed.ts               ← Data awal development
```

---

## 🔐 Autentikasi

Semua endpoint yang butuh login menggunakan **JWT Bearer Token**.

```
Authorization: Bearer <token>
```

Token didapat setelah **register** atau **login**.

---

## 📋 Endpoint Utama

### Auth
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/v1/auth/register` | Registrasi akun baru |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/me` | Profil pengguna (🔒) |
| PATCH | `/api/v1/auth/me` | Update profil (🔒) |

### Venues
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/v1/venues` | List semua venue (publik) |
| GET | `/api/v1/venues/:id` | Detail venue (publik) |
| GET | `/api/v1/venues/owner/my` | Venue milik owner (🔒 owner) |
| POST | `/api/v1/venues` | Tambah venue (🔒 owner) |
| PATCH | `/api/v1/venues/:id` | Update venue (🔒 owner) |
| DELETE | `/api/v1/venues/:id` | Nonaktifkan venue (🔒 owner) |

### Fields
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/v1/fields/:id` | Detail lapangan (publik) |
| GET | `/api/v1/fields/:id/slots?date=YYYY-MM-DD` | Cek slot tersedia (publik) |
| POST | `/api/v1/fields` | Tambah lapangan (🔒 owner) |
| PATCH | `/api/v1/fields/:id` | Update lapangan (🔒 owner) |
| POST | `/api/v1/fields/:id/images` | Upload foto (🔒 owner) |
| DELETE | `/api/v1/fields/:id` | Nonaktifkan lapangan (🔒 owner) |

### Bookings
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/v1/bookings` | Buat booking (🔒 player) |
| GET | `/api/v1/bookings/my` | Riwayat booking saya (🔒) |
| GET | `/api/v1/bookings/:id` | Detail booking (🔒) |
| PATCH | `/api/v1/bookings/:id/cancel` | Batalkan booking (🔒 player) |
| GET | `/api/v1/bookings/owner/incoming` | Booking masuk (🔒 owner) |
| GET | `/api/v1/bookings/owner/revenue` | Laporan pendapatan (🔒 owner) |

### Operating Hours
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/v1/operating-hours/:venueId` | Jam operasional (publik) |
| PUT | `/api/v1/operating-hours/:venueId` | Set jam operasional (🔒 owner) |

---

## 🛡️ Pencegahan Double Booking

Diimplementasikan **2 lapis**:
1. **Lapis 1 (Query):** Backend mengecek overlap booking sebelum insert
2. **Lapis 2 (Database):** Unique constraint `@@unique([fieldId, bookingDate, startTime, endTime])` di Prisma schema

---

## 👤 Akun Test (setelah `bun db:seed`)

| Role | Email | Password |
|------|-------|----------|
| Owner | owner@futsal.com | password123 |
| Player | player@futsal.com | password123 |
