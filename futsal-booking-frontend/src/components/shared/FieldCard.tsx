import { Link } from 'react-router-dom'
import { MapPin, Layers } from 'lucide-react'
import { formatRupiah, SURFACE_LABELS } from '@/lib/utils'
import type { Field } from '@/types'

interface Props { field: Field }

export default function FieldCard({ field }: Props) {
  const primaryImage = field.images?.find((i) => i.isPrimary) ?? field.images?.[0]

  return (
    <Link
      to={`/venues/${field.venueId}/fields/${field.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-primary-200 hover:shadow-lg transition-all duration-200"
    >
      <div className="aspect-video bg-slate-100 overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.imageUrl}
            alt={field.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Layers size={32} />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display font-bold text-slate-900 text-lg">{field.name}</h3>

        {field.venue && (
          <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
            <MapPin size={12} />
            <span>{field.venue.name} — {field.venue.address}</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600">
            {SURFACE_LABELS[field.surfaceType]}
          </span>
          <span className="font-bold text-primary-600">
            {formatRupiah(field.pricePerHour)}<span className="text-slate-400 font-normal text-xs">/jam</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
