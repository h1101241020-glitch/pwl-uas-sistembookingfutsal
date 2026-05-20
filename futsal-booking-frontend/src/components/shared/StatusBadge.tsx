import { STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import type { BookingStatus } from '@/types'
import { cn } from '@/lib/utils'

interface Props { status: BookingStatus }

export default function StatusBadge({ status }: Props) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', STATUS_COLORS[status])}>
      {STATUS_LABELS[status]}
    </span>
  )
}
