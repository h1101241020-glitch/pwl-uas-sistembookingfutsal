import api from './api'
import type { Venue, VenueFilters, PaginatedResponse } from '@/types'

export const venueService = {
  async getAll(filters?: VenueFilters): Promise<PaginatedResponse<Venue>> {
    const { data } = await api.get<PaginatedResponse<Venue>>('/venues', { params: filters })
    return data
  },

  async getById(id: string): Promise<Venue> {
    const { data } = await api.get<{ data: Venue }>(`/venues/${id}`)
    return data.data
  },

  async getMyVenues(): Promise<Venue[]> {
    const { data } = await api.get<{ data: Venue[] }>('/owner/venues')
    return data.data
  },

  async create(payload: Partial<Venue>): Promise<Venue> {
    const { data } = await api.post<{ data: Venue }>('/owner/venues', payload)
    return data.data
  },

  async update(id: string, payload: Partial<Venue>): Promise<Venue> {
    const { data } = await api.put<{ data: Venue }>(`/owner/venues/${id}`, payload)
    return data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/owner/venues/${id}`)
  },
}
