import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMyBookings } from '@/hooks/useBookings'
import StatusBadge from '@/components/shared/StatusBadge'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { formatDate, formatTime, formatRupiah } from '@/lib/utils'
import type { BookingStatus } from '@/types'

const STATUSES = [
  { value: '', label: 'Semua' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'confirmed', label: 'Dikonfirmasi' },
  { value: 'cancelled', label: 'Dibatalkan' },
]

export default function BookingHistoryPage() {
  const [status, setStatus] = useState<BookingStatus | ''>('')
  const { data: bookings, isLoading } = useMyBookings(status || undefined)

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-6">Riwayat Booking</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {STATUSES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatus(value as BookingStatus | '')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${status === value ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-16" />
      ) : (bookings ?? []).length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p>Tidak ada booking dengan status ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(bookings ?? []).map((b) => (
            <Link
              key={b.id}
              to={`/player/bookings/${b.id}`}
              className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 hover:border-primary-200 hover:shadow-sm transition-all"
            >
              <div>
                <p className="font-display font-bold text-slate-900">{b.field?.name}</p>
                <p className="text-slate-500 text-sm">{b.field?.venue?.name}</p>
                <p className="text-slate-400 text-xs mt-1">{formatDate(b.bookingDate)} · {formatTime(b.startTime)}–{formatTime(b.endTime)}</p>
              </div>
              <div className="text-right">
                <StatusBadge status={b.status} />
                <p className="text-sm font-bold text-slate-900 mt-2">{formatRupiah(b.totalPrice)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
