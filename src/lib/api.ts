// Simple API utility for handling all API requests
// Usage: import api from '@/lib/api'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function getToken() {
  return localStorage.getItem('vtps_token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = true
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (requireAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Token ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    let errorMsg = 'API error';
    try {
      const err = await res.json();
      errorMsg = err.detail || JSON.stringify(err);
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
}

const api = {
  get: <T>(endpoint: string, requireAuth = true) =>
    request<T>(endpoint, { method: 'GET' }, requireAuth),
  post: <T>(endpoint: string, data?: any, requireAuth = true) =>
    request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }, requireAuth),
  put: <T>(endpoint: string, data?: any, requireAuth = true) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }, requireAuth),
  patch: <T>(endpoint: string, data?: any, requireAuth = true) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }, requireAuth),
  delete: <T>(endpoint: string, requireAuth = true) =>
    request<T>(endpoint, { method: 'DELETE' }, requireAuth),
  setToken: (token: string) => {
    localStorage.setItem('vtps_token', token);
  },
  clearToken: () => {
    localStorage.removeItem('vtps_token');
  },
};

export default api; 