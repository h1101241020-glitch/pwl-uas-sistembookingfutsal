import { Link, useNavigate } from 'react-router-dom'
import { LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const dashboardPath = user?.role === 'owner' ? '/owner/dashboard' : '/player/home'

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-display font-bold">F</span>
            </span>
            <span className="font-display font-bold text-xl text-slate-900">FutsalKu</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/venues" className="text-sm text-slate-600 hover:text-primary-600 transition-colors font-medium">
              Katalog Lapangan
            </Link>
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className="text-sm text-slate-600 hover:text-primary-600 transition-colors font-medium">
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <User size={14} className="text-primary-600" />
                    </div>
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-500 transition-colors"
                  >
                    <LogOut size={14} />
                    Keluar
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors">
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Daftar
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3">
          <Link to="/venues" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-slate-700">
            Katalog Lapangan
          </Link>
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-slate-700">
                Dashboard
              </Link>
              <button onClick={logout} className="block text-sm text-red-500">Keluar</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-slate-700">Masuk</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold text-primary-600">Daftar</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
