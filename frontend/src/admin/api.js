const API = import.meta.env.VITE_API_URL || '/api';
const KEY = 'inv_admin_token';

export const getToken = () => localStorage.getItem(KEY);
export const setToken = (t) => (t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY));

export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = { Authorization: `Bearer ${getToken() || ''}` };
  if (body) headers['Content-Type'] = 'application/json';
  const r = await fetch(`${API}${path}`, { method, headers, body: form || (body ? JSON.stringify(body) : undefined) });
  const j = await r.json().catch(() => ({}));
  if (r.status === 401 && path !== '/admin/login') {
    setToken(null);
    window.dispatchEvent(new Event('admin-logout'));
  }
  if (!r.ok) throw new Error(j.error || 'Permintaan gagal');
  return j;
}
