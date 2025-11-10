// src/api/apiClient.js
import { API_URL } from '../utils/env';

class ApiClient {
  constructor() {
    this.baseURL = API_URL;
    this.refreshing = null;
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  async ensureToken() {
    const token = this.getToken();
    if (token) return token;

    if (!this.refreshing) {
      this.refreshing = this._refreshToken();
    }
    return await this.refreshing;
  }

  async _refreshToken() {
    try {
      const res = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Refresh failed');
      const { accessToken } = await res.json();
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    } catch {
      localStorage.clear();
      window.location.href = '/login';
      throw new Error('Sesión expirada');
    } finally {
      this.refreshing = null;
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      credentials: 'include',
    };

    const token = await this.ensureToken();
    if (token) config.headers['Authorization'] = `Bearer ${token}`;

    let res = await fetch(url, config);

    if (res.status === 401 && !options._retry) {
      await this._refreshToken();
      return this.request(endpoint, { ...options, _retry: true });
    }

    if (!res.ok) {
      let msg = 'Error';
      try { const err = await res.json(); msg = err.message || msg; } catch {}
      throw new Error(msg);
    }

    return res.json();
  }

  get = (e) => this.request(e, { method: 'GET' });
  post = (e, d) => this.request(e, { method: 'POST', body: JSON.stringify(d) });
  put = (e, d) => this.request(e, { method: 'PUT', body: JSON.stringify(d) });
  delete = (e) => this.request(e, { method: 'DELETE' });
}

export const api = new ApiClient();