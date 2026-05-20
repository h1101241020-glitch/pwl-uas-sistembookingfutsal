# FutsalKu — Frontend

Website booking lapangan futsal online untuk Kota Pontianak, Kalimantan Barat.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Runtime | Bun |
| Framework | React 19 + TypeScript |
| Bundler | Vite |
| Routing | React Router v6 |
| Server State | TanStack Query v5 |
| Client State | Zustand v4 |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |
| Styling | Tailwind CSS v3 |
| Calendar | FullCalendar v6 |
| Date Utils | Day.js |
| Icons | Lucide React |

## Struktur Folder

```
src/
├── assets/           # Gambar, font, dll
├── components/
│   ├── layout/       # Navbar, Sidebar, DashboardLayout, PublicLayout
│   ├── shared/       # Komponen reusable (FieldCard, StatusBadge, dll)
│   └── ui/           # shadcn/ui primitives
├── hooks/            # Custom hooks (useAuth, useVenues, useBookings)
├── lib/              # utils.ts (cn, formatRupiah, dll)
├── pages/
│   ├── public/       # Landing, Login, Register, Katalog
│   ├── player/       # Beranda, Cari, Jadwal, Booking, Profil
│   └── owner/        # Dashboard, Venue, Lapangan, Kalender, Laporan
├── services/         # api.ts + service files per domain
├── stores/           # Zustand stores (authStore)
├── types/            # TypeScript interfaces
└── utils/            # validation schemas (Zod)
```

## Memulai

```bash
# 1. Install dependencies
bun install

# 2. Copy env file
cp .env.example .env

# 3. Edit VITE_API_URL di .env sesuai URL backend

# 4. Jalankan development server
bun dev
```

## Perintah Bun

```bash
bun install          # Install semua dependencies
bun dev              # Jalankan development server (localhost:3000)
bun run build        # Build untuk production
bun run preview      # Preview hasil build
bun run lint         # Jalankan ESLint
bun add <package>    # Tambah dependency baru
bun remove <package> # Hapus dependency
bun update           # Update semua dependencies
```

## Halaman yang Sudah Dibangun

### Publik
- [x] Landing Page (`/`)
- [x] Login (`/login`)
- [x] Register (`/register`)
- [x] Katalog Lapangan (`/venues`)

### Pemain
- [x] Beranda Pemain (`/player/home`)
- [x] Riwayat Booking (`/player/bookings`)
- [ ] Cari Lapangan (`/player/search`)
- [ ] Pilih Jadwal (`/player/schedule/:fieldId`)
- [ ] Konfirmasi Booking
- [ ] Detail Booking
- [ ] Profil

### Pemilik Lapangan
- [x] Dashboard (`/owner/dashboard`)
- [ ] Kelola Venue
- [ ] Kelola Lapangan
- [ ] Jam Operasional
- [ ] Booking Masuk
- [ ] Kalender
- [ ] Laporan
- [ ] Profil

## Konvensi Kode

- **Komponen**: PascalCase (`FieldCard.tsx`)
- **Hooks**: camelCase dengan prefix `use` (`useBookings.ts`)
- **Services**: camelCase dengan suffix `.service.ts`
- **Types**: Interface, bukan Type alias untuk objek
- **API calls**: Selalu via service layer, bukan langsung dari komponen
