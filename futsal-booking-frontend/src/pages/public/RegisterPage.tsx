import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import ErrorMessage from '@/components/shared/ErrorMessage'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(9, 'Nomor HP tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  role: z.enum(['player', 'owner']),
})
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const { register: registerUser, registerPending, registerError } = useAuth()
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'player' },
  })
  const role = watch('role')

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-bold text-slate-900">Buat Akun</h1>
          <p className="text-slate-500 text-sm mt-1">Sudah punya akun? <Link to="/login" className="text-primary-600 font-medium">Masuk</Link></p>
        </div>

        <form onSubmit={handleSubmit((data) => registerUser(data))} className="space-y-4">
          {registerError && <ErrorMessage message="Pendaftaran gagal. Coba lagi." />}

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3">
            {(['player', 'owner'] as const).map((r) => (
              <label key={r} className={`flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-colors ${role === r ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                <input {...register('role')} type="radio" value={r} className="sr-only" />
                <span className="text-sm font-semibold">{r === 'player' ? '⚽ Pemain' : '🏟️ Pemilik'}</span>
              </label>
            ))}
          </div>

          {[
            { name: 'name' as const, label: 'Nama Lengkap', type: 'text', placeholder: 'John Doe' },
            { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'email@contoh.com' },
            { name: 'phone' as const, label: 'Nomor HP', type: 'tel', placeholder: '08123456789' },
            { name: 'password' as const, label: 'Password', type: 'password', placeholder: '••••••••' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
              <input
                {...register(name)}
                type={type}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
            </div>
          ))}

          <button
            type="submit"
            disabled={registerPending}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {registerPending ? <><LoadingSpinner size="sm" /><span>Mendaftar...</span></> : 'Buat Akun'}
          </button>
        </form>
      </div>
    </div>
  )
}
