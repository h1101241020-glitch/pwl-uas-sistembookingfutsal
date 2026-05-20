import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-slate-900 text-slate-400 text-sm py-8 text-center">
        © 2026 FutsalKu — Booking Lapangan Futsal Pontianak
      </footer>
    </div>
  )
}
