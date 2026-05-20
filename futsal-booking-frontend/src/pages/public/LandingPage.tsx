import { Link } from 'react-router-dom'
import { Search, MapPin, Calendar, ShieldCheck } from 'lucide-react'

const features = [
  { icon: Search, title: 'Cari Lapangan', desc: 'Filter berdasarkan area, harga, dan jenis permukaan.' },
  { icon: Calendar, title: 'Booking Instan', desc: 'Pilih jadwal dan konfirmasi booking dalam hitungan detik.' },
  { icon: ShieldCheck, title: 'Tanpa Double Booking', desc: 'Sistem otomatis mencegah tumpang tindih jadwal.' },
  { icon: MapPin, title: 'Lapangan se-Pontianak', desc: 'Ratusan lapangan tersebar di seluruh kota.' },
]

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-primary-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <span className="inline-block px-4 py-1.5 bg-primary-500/20 text-primary-300 text-sm font-semibold rounded-full mb-6 border border-primary-500/30">
            🏟️ Kota Pontianak, Kalimantan Barat
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-extrabold leading-tight text-balance">
            Booking Lapangan Futsal<br />
            <span className="text-primary-400">Kapan Saja, Di Mana Saja</span>
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
            Temukan lapangan futsal terbaik di Pontianak, cek ketersediaan jadwal secara real-time, dan booking dalam beberapa klik.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/venues"
              className="px-8 py-4 bg-primary-500 hover:bg-primary-400 text-white font-bold rounded-xl transition-colors text-lg shadow-lg shadow-primary-500/30"
            >
              Booking Sekarang →
            </Link>
            <Link
              to="/register?role=owner"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-colors"
            >
              Daftarkan Lapangan Anda
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="font-display text-3xl font-bold text-center text-slate-900 mb-12">
          Mengapa Pilih FutsalKu?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-6 rounded-2xl border border-slate-100 hover:border-primary-100 hover:bg-primary-50/30 transition-colors">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon className="text-primary-600" size={22} />
              </div>
              <h3 className="font-display font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white py-20 text-center">
        <h2 className="font-display text-4xl font-extrabold mb-4">Siap Bermain?</h2>
        <p className="text-primary-100 mb-8">Bergabung dengan ribuan pemain yang sudah booking lewat FutsalKu.</p>
        <Link to="/register" className="inline-block px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-colors">
          Buat Akun Gratis
        </Link>
      </section>
    </div>
  )
}
