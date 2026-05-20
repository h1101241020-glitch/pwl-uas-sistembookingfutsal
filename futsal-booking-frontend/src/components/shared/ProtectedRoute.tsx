import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import type { Role } from '@/types'

interface Props { role?: Role }

export default function ProtectedRoute({ role }: Props) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'owner' ? '/owner/dashboard' : '/player/home'} replace />
  }

  return <Outlet />
}
