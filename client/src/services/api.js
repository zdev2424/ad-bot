const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Gets the raw Telegram initData string from window.Telegram.WebApp
 */
export function getTelegramInitData() {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp.initData || '';
  }
  return '';
}

/**
 * Wrapper around fetch that automatically includes Telegram initData
 */
export async function apiRequest(endpoint, options = {}) {
  const initData = getTelegramInitData();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (initData) {
    headers['Authorization'] = `Bearer ${initData}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}`);
  }

  return data;
}

export const authApi = {
  verify: () => apiRequest('/auth/verify', { method: 'POST' }),
  getMe: () => apiRequest('/auth/me', { method: 'GET' })
};

export const tasksApi = {
  getStatus: () => apiRequest('/tasks/status', { method: 'GET' }),
  complete: (slotNumber) =>
    apiRequest('/tasks/complete', {
      method: 'POST',
      body: JSON.stringify({ slotNumber })
    })
};

export const dashboardApi = {
  getStats: () => apiRequest('/dashboard/stats', { method: 'GET' })
};
