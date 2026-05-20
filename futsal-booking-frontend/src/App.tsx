import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import PublicLayout from '@/components/layout/PublicLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProtectedRoute from '@/components/shared/ProtectedRoute'

// Public Pages
import LandingPage from '@/pages/public/LandingPage'
import LoginPage from '@/pages/public/LoginPage'
import RegisterPage from '@/pages/public/RegisterPage'
import VenueCatalogPage from '@/pages/public/VenueCatalogPage'

// Player Pages
import PlayerHomePage from '@/pages/player/PlayerHomePage'
import BookingHistoryPage from '@/pages/player/BookingHistoryPage'

// Owner Pages
import OwnerDashboardPage from '@/pages/owner/OwnerDashboardPage'

// Placeholder for pages to be built
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center min-h-60">
      <div className="text-center">
        <p className="text-4xl mb-3">🚧</p>
        <h2 className="font-display font-bold text-slate-900">{title}</h2>
        <p className="text-slate-400 text-sm mt-1">Halaman ini sedang dalam pengembangan.</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── PUBLIC ───────────────────────────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/venues" element={<VenueCatalogPage />} />
          <Route path="/venues/:venueId/fields/:fieldId" element={<ComingSoon title="Detail Lapangan" />} />
        </Route>

        {/* ── PLAYER ───────────────────────────────────────────── */}
        <Route element={<ProtectedRoute role="player" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/player/home" element={<PlayerHomePage />} />
            <Route path="/player/search" element={<ComingSoon title="Cari Lapangan" />} />
            <Route path="/player/schedule/:fieldId" element={<ComingSoon title="Pilih Jadwal" />} />
            <Route path="/player/booking/confirm" element={<ComingSoon title="Konfirmasi Booking" />} />
            <Route path="/player/bookings" element={<BookingHistoryPage />} />
            <Route path="/player/bookings/:id" element={<ComingSoon title="Detail Booking" />} />
            <Route path="/player/profile" element={<ComingSoon title="Profil Saya" />} />
          </Route>
        </Route>

        {/* ── OWNER ────────────────────────────────────────────── */}
        <Route element={<ProtectedRoute role="owner" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
            <Route path="/owner/venues" element={<ComingSoon title="Kelola Venue" />} />
            <Route path="/owner/venues/new" element={<ComingSoon title="Tambah Venue" />} />
            <Route path="/owner/venues/:id/edit" element={<ComingSoon title="Edit Venue" />} />
            <Route path="/owner/fields" element={<ComingSoon title="Kelola Lapangan" />} />
            <Route path="/owner/hours" element={<ComingSoon title="Jam Operasional" />} />
            <Route path="/owner/bookings" element={<ComingSoon title="Booking Masuk" />} />
            <Route path="/owner/calendar" element={<ComingSoon title="Kalender Jadwal" />} />
            <Route path="/owner/reports" element={<ComingSoon title="Laporan Pendapatan" />} />
            <Route path="/owner/profile" element={<ComingSoon title="Profil Pemilik" />} />
          </Route>
        </Route>

        {/* ── FALLBACK ─────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
