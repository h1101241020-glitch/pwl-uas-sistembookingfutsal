import { Link } from 'react-router-dom'
import { Calendar, Search, Clock } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useMyBookings } from '@/hooks/useBookings'
import StatusBadge from '@/components/shared/StatusBadge'
import { formatDate, formatTime, formatRupiah } from '@/lib/utils'

export default function PlayerHomePage() {
  const { user } = useAuthStore()
  const { data: bookings, isLoading } = useMyBookings('confirmed')
  const upcoming = bookings?.slice(0, 3) ?? []

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">
          Halo, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-500 mt-1">Siap main futsal hari ini?</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link to="/player/search" className="flex items-center gap-3 p-5 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-colors">
          <Search size={22} />
          <div>
            <div className="font-display font-bold">Cari Lapangan</div>
            <div className="text-primary-200 text-xs">Temukan slot tersedia</div>
          </div>
        </Link>
        <Link to="/player/bookings" className="flex items-center gap-3 p-5 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
          <Calendar size={22} className="text-slate-600" />
          <div>
            <div className="font-display font-bold text-slate-900">Riwayat</div>
            <div className="text-slate-400 text-xs">Semua booking Anda</div>
          </div>
        </Link>
      </div>

      {/* Upcoming bookings */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-display font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
          <Clock size={18} className="text-primary-600" />
          Booking Mendatang
        </h2>

        {isLoading ? (
          <p className="text-slate-400 text-sm">Memuat...</p>
        ) : upcoming.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm">Belum ada booking yang akan datang.</p>
            <Link to="/player/search" className="text-primary-600 font-medium text-sm mt-2 inline-block">Booking sekarang →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <Link key={b.id} to={`/player/bookings/${b.id}`} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-primary-50 transition-colors">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{b.field?.name}</p>
                  <p className="text-slate-500 text-xs">{formatDate(b.bookingDate)} · {formatTime(b.startTime)}–{formatTime(b.endTime)}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={b.status} />
                  <p className="text-xs text-slate-500 mt-1">{formatRupiah(b.totalPrice)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
