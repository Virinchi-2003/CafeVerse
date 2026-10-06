const API_BASE = '/api/v1';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('cafeverse_mobile_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Mobile API Request failed');
  }

  return data as T;
}

export const api = {
  login: (body: any) => fetchApi<{ token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body: any) => fetchApi<{ token: string; user: any }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => fetchApi<{ user: any }>('/auth/me'),

  getCategories: () => fetchApi<{ categories: any[] }>('/menu/categories'),
  getMenuItems: (categoryId?: string) => {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    return fetchApi<{ items: any[] }>(`/menu/items${query}`);
  },

  getAvailability: (date: string) => fetchApi<{ slots: any[]; maxPartySize: number }>(`/reservations/availability?date=${date}`),
  createReservation: (body: any) => fetchApi<{ message: string; reservation: any }>('/reservations', { method: 'POST', body: JSON.stringify(body) }),
  getMyReservations: () => fetchApi<{ reservations: any[] }>('/reservations/mine'),
  cancelReservation: (id: string) => fetchApi<{ message: string }>(`/reservations/mine/${id}/cancel`, { method: 'PATCH' }),

  // Mobile Admin
  getAdminReservations: () => fetchApi<{ reservations: any[] }>('/reservations/admin/all'),
  updateReservationStatus: (id: string, status: string) => fetchApi<{ message: string }>(`/reservations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  updateMenuItem: (id: string, body: any) => fetchApi<{ message: string }>(`/menu/items/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
};
