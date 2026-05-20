import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useVenues } from '@/hooks/useVenues'
import FieldCard from '@/components/shared/FieldCard'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import type { SurfaceType } from '@/types'

export default function VenueCatalogPage() {
  const [search, setSearch] = useState('')
  const [surfaceType, setSurfaceType] = useState<SurfaceType | ''>('')

  const { data, isLoading } = useVenues({ search: search || undefined, surfaceType: surfaceType || undefined })

  // Flatten all fields from all venues
  const allFields = data?.data.flatMap((v) => (v.fields ?? []).map((f) => ({ ...f, venue: v }))) ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-extrabold text-slate-900 mb-2">Katalog Lapangan</h1>
      <p className="text-slate-500 mb-8">Temukan lapangan futsal terbaik di Pontianak</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Cari nama venue atau area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={surfaceType}
          onChange={(e) => setSurfaceType(e.target.value as SurfaceType | '')}
          className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="">Semua Permukaan</option>
          <option value="vinyl">Vinyl</option>
          <option value="grass">Rumput Sintetis</option>
          <option value="parquet">Parket</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-24" />
      ) : allFields.length === 0 ? (
        <div className="text-center py-24 text-slate-400">
          <SlidersHorizontal size={40} className="mx-auto mb-3 opacity-40" />
          <p>Tidak ada lapangan yang cocok dengan filter Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allFields.map((field) => (
            <FieldCard key={field.id} field={field} />
          ))}
        </div>
      )}
    </div>
  )
}
