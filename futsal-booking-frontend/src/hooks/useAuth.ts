import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/auth.service'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const { user, token, isAuthenticated, login, logout } = useAuthStore()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: ({ user, token }) => {
      login(user, token)
      if (user.role === 'owner') navigate('/owner/dashboard')
      else navigate('/player/home')
    },
  })

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: ({ user, token }) => {
      login(user, token)
      if (user.role === 'owner') navigate('/owner/dashboard')
      else navigate('/player/home')
    },
  })

  return {
    user,
    token,
    isAuthenticated,
    isOwner: user?.role === 'owner',
    isPlayer: user?.role === 'player',
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    loginPending: loginMutation.isPending,
    registerPending: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  }
}
