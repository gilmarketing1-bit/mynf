const API = process.env.NEXT_PUBLIC_API_URL || 'https://mynf-production.up.railway.app/api';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('mynf_token');
}

export function setToken(token: string): void {
  localStorage.setItem('mynf_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('mynf_token');
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message || `Erro ${res.status}`);
  }
  return res.json();
}
