import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { venueService } from '@/services/venue.service'
import type { VenueFilters } from '@/types'

export function useVenues(filters?: VenueFilters) {
  return useQuery({
    queryKey: ['venues', filters],
    queryFn: () => venueService.getAll(filters),
  })
}

export function useVenue(id: string) {
  return useQuery({
    queryKey: ['venues', id],
    queryFn: () => venueService.getById(id),
    enabled: !!id,
  })
}

export function useMyVenues() {
  return useQuery({
    queryKey: ['owner', 'venues'],
    queryFn: venueService.getMyVenues,
  })
}

export function useCreateVenue() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: venueService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['owner', 'venues'] }),
  })
}
