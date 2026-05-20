import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import ErrorMessage from '@/components/shared/ErrorMessage'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const schema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { login, loginPending, loginError } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="mb-8 text-center">
          <span className="inline-flex w-12 h-12 bg-primary-600 rounded-xl items-center justify-center mb-4">
            <span className="text-white text-xl font-display font-bold">F</span>
          </span>
          <h1 className="font-display text-2xl font-bold text-slate-900">Masuk ke FutsalKu</h1>
          <p className="text-slate-500 text-sm mt-1">Belum punya akun? <Link to="/register" className="text-primary-600 font-medium">Daftar sekarang</Link></p>
        </div>

        <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
          {loginError && <ErrorMessage message="Email atau password salah." />}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="email@contoh.com"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loginPending}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loginPending ? <><LoadingSpinner size="sm" /><span>Memproses...</span></> : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}
