import { CalendarCheck, DollarSign, TrendingUp, BookOpen } from 'lucide-react'

// TODO: Replace with real API data
const mockStats = [
  { label: 'Booking Hari Ini', value: '12', icon: CalendarCheck, color: 'text-blue-600 bg-blue-50' },
  { label: 'Pendapatan Bulan Ini', value: 'Rp 14.500.000', icon: DollarSign, color: 'text-green-600 bg-green-50' },
  { label: 'Total Lapangan', value: '4', icon: BookOpen, color: 'text-purple-600 bg-purple-50' },
  { label: 'Tingkat Ocupansi', value: '78%', icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
]

export default function OwnerDashboardPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Ringkasan</h1>
      <p className="text-slate-500 mb-8">Gambaran umum bisnis lapangan Anda hari ini.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {mockStats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-display font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-display font-bold text-slate-900 mb-4">Booking Terbaru</h2>
        <p className="text-slate-400 text-sm">Data akan muncul setelah terhubung ke backend.</p>
      </div>
    </div>
  )
}
