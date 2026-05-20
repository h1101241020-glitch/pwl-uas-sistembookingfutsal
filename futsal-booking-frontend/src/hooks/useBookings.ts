import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingService } from '@/services/booking.service'
import type { BookingStatus } from '@/types'

export function useMyBookings(status?: BookingStatus) {
  return useQuery({
    queryKey: ['bookings', 'my', status],
    queryFn: () => bookingService.getMyBookings(status),
  })
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => bookingService.getById(id),
    enabled: !!id,
  })
}

export function useFieldSlots(fieldId: string, date: string) {
  return useQuery({
    queryKey: ['slots', fieldId, date],
    queryFn: () => bookingService.getFieldSlots(fieldId, date),
    enabled: !!fieldId && !!date,
    staleTime: 30_000, // 30s - slots change frequently
  })
}

export function useCreateBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: bookingService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  })
}

export function useCancelBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: bookingService.cancel,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  })
}
