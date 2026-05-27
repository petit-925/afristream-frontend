export { API_BASE_URL, UPLOADS_BASE_URL } from '../config/api';
import { API_BASE_URL } from '../config/api';

export async function apiClient(path: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${path}`;
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  } as Record<string, string>;

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function normalizeUploadUrl(raw?: string) {
  if (!raw) return '';
  return String(raw).replace(/\\/g, '/').replace(/\/api\/v\d+\//i, '/');
}
