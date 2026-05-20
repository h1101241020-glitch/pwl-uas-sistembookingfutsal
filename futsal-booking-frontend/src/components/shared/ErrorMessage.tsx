import { AlertCircle } from 'lucide-react'

interface Props { message?: string }

export default function ErrorMessage({ message = 'Terjadi kesalahan. Coba lagi.' }: Props) {
  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
      <AlertCircle size={16} className="shrink-0" />
      {message}
    </div>
  )
}
