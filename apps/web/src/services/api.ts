const API_BASE = '/api/v1';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('cafeverse_token');
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
    throw new Error(data.error || 'API Request failed');
  }

  return data as T;
}

// API Methods
export const api = {
  // Auth
  register: (body: any) => fetchApi<{ message: string; token: string; user: any }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => fetchApi<{ message: string; token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => fetchApi<{ user: any }>('/auth/me'),

  // Cafe Settings
  getSettings: () => fetchApi<{ settings: any }>('/cafe/settings'),
  updateSettings: (body: any) => fetchApi<{ message: string }>('/cafe/settings', { method: 'PATCH', body: JSON.stringify(body) }),

  // Menu
  getCategories: () => fetchApi<{ categories: any[] }>('/menu/categories'),
  createCategory: (body: any) => fetchApi<{ message: string; id: string }>('/menu/categories', { method: 'POST', body: JSON.stringify(body) }),
  getMenuItems: (params: { categoryId?: string; categorySlug?: string; search?: string; featuredOnly?: boolean; includeUnavailable?: boolean } = {}) => {
    const query = new URLSearchParams();
    if (params.categoryId) query.append('categoryId', params.categoryId);
    if (params.categorySlug) query.append('categorySlug', params.categorySlug);
    if (params.search) query.append('search', params.search);
    if (params.featuredOnly) query.append('featuredOnly', 'true');
    if (params.includeUnavailable) query.append('includeUnavailable', 'true');
    return fetchApi<{ items: any[] }>(`/menu/items?${query.toString()}`);
  },
  createMenuItem: (body: any) => fetchApi<{ message: string; id: string }>('/menu/items', { method: 'POST', body: JSON.stringify(body) }),
  updateMenuItem: (id: string, body: any) => fetchApi<{ message: string }>(`/menu/items/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteMenuItem: (id: string) => fetchApi<{ message: string }>(`/menu/items/${id}`, { method: 'DELETE' }),

  // Reservations
  getAvailability: (date: string) => fetchApi<{ date: string; isClosed: boolean; maxPartySize: number; slots: any[] }>(`/reservations/availability?date=${date}`),
  createReservation: (body: any) => fetchApi<{ message: string; reservation: any }>('/reservations', { method: 'POST', body: JSON.stringify(body) }),
  getMyReservations: () => fetchApi<{ reservations: any[] }>('/reservations/mine'),
  cancelReservation: (id: string) => fetchApi<{ message: string }>(`/reservations/mine/${id}/cancel`, { method: 'PATCH' }),
  getAdminReservations: (params: { date?: string; status?: string; search?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.date) query.append('date', params.date);
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    return fetchApi<{ reservations: any[] }>(`/reservations/admin/all?${query.toString()}`);
  },
  updateReservationStatus: (id: string, status: string, internalNotes?: string) => 
    fetchApi<{ message: string }>(`/reservations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, internalNotes }) }),

  // Admin Dashboard & Tables
  getAdminDashboard: () => fetchApi<any>('/admin/dashboard'),
  getAdminTables: () => fetchApi<{ tables: any[] }>('/admin/tables'),
  createTable: (body: any) => fetchApi<{ message: string; id: string }>('/admin/tables', { method: 'POST', body: JSON.stringify(body) }),
  updateTable: (id: string, body: any) => fetchApi<{ message: string }>(`/admin/tables/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteTable: (id: string) => fetchApi<{ message: string }>(`/admin/tables/${id}`, { method: 'DELETE' }),
  getCustomers: () => fetchApi<{ customers: any[] }>('/admin/customers'),
  getAuditLogs: () => fetchApi<{ logs: any[] }>('/admin/audit-logs'),

  // Reviews
  getReviews: () => fetchApi<{ reviews: any[] }>('/reviews'),
  submitReview: (body: any) => fetchApi<{ message: string; id: string }>('/reviews', { method: 'POST', body: JSON.stringify(body) }),
};
