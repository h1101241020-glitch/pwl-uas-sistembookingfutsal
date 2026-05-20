import api from './api'
import type { Booking, BookingStatus, PaginatedResponse } from '@/types'

export const bookingService = {
  async create(payload: {
    fieldId: string
    bookingDate: string
    startTime: string
    endTime: string
  }): Promise<Booking> {
    const { data } = await api.post<{ data: Booking }>('/bookings', payload)
    return data.data
  },

  async getMyBookings(status?: BookingStatus): Promise<Booking[]> {
    const { data } = await api.get<{ data: Booking[] }>('/bookings/my', {
      params: { status },
    })
    return data.data
  },

  async getById(id: string): Promise<Booking> {
    const { data } = await api.get<{ data: Booking }>(`/bookings/${id}`)
    return data.data
  },

  async cancel(id: string): Promise<Booking> {
    const { data } = await api.patch<{ data: Booking }>(`/bookings/${id}/cancel`)
    return data.data
  },

  // For owner
  async getVenueBookings(filters?: {
    fieldId?: string
    status?: BookingStatus
    startDate?: string
    endDate?: string
  }): Promise<PaginatedResponse<Booking>> {
    const { data } = await api.get<PaginatedResponse<Booking>>('/owner/bookings', {
      params: filters,
    })
    return data
  },

  async getFieldSlots(fieldId: string, date: string): Promise<Booking[]> {
    const { data } = await api.get<{ data: Booking[] }>(`/fields/${fieldId}/slots`, {
      params: { date },
    })
    return data.data
  },
}
