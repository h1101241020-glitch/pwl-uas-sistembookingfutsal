import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, MapPin, Calendar, BookOpen, BarChart2,
  Clock, User, Search, History, Home,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

const playerLinks = [
  { to: '/player/home', icon: Home, label: 'Beranda' },
  { to: '/player/search', icon: Search, label: 'Cari Lapangan' },
  { to: '/player/bookings', icon: History, label: 'Riwayat Booking' },
  { to: '/player/profile', icon: User, label: 'Profil Saya' },
]

const ownerLinks = [
  { to: '/owner/dashboard', icon: LayoutDashboard, label: 'Ringkasan' },
  { to: '/owner/venues', icon: MapPin, label: 'Kelola Venue' },
  { to: '/owner/fields', icon: BookOpen, label: 'Kelola Lapangan' },
  { to: '/owner/hours', icon: Clock, label: 'Jam Operasional' },
  { to: '/owner/bookings', icon: Calendar, label: 'Booking Masuk' },
  { to: '/owner/calendar', icon: Calendar, label: 'Kalender Jadwal' },
  { to: '/owner/reports', icon: BarChart2, label: 'Laporan Pendapatan' },
  { to: '/owner/profile', icon: User, label: 'Profil Pemilik' },
]

export default function Sidebar() {
  const { user } = useAuthStore()
  const links = user?.role === 'owner' ? ownerLinks : playerLinks

  return (
    <aside className="w-60 shrink-0 border-r border-slate-100 bg-white min-h-screen pt-6 px-3">
      <nav className="space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
