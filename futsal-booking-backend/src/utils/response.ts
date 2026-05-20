// src/utils/response.ts
// Helper untuk format response API yang konsisten

export const successResponse = (data: unknown, message = "Berhasil", meta?: object) => ({
  success: true,
  message,
  data,
  ...(meta ? { meta } : {}),
});

export const errorResponse = (message: string, errors?: unknown) => ({
  success: false,
  message,
  ...(errors ? { errors } : {}),
});

export const paginatedResponse = (
  data: unknown,
  total: number,
  page: number,
  limit: number,
  message = "Berhasil"
) => ({
  success: true,
  message,
  data,
  meta: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  },
});
