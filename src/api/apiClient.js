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
    let token = this.getToken();
    if (token) return token;

    if (!this.refreshing) {
      this.refreshing = this._refreshToken();
    }
    try {
      token = await this.refreshing;
    } catch (err) {
      throw err; // Deja que el caller maneje (e.g., logout)
    }
    return token;
  }

  async _refreshToken() {
    try {
      const res = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Refresh failed');
      }
      const { accessToken } = await res.json();
      if (!accessToken) throw new Error('No access token in response');
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    } catch (err) {
      localStorage.removeItem('accessToken');
      throw err; // No redirigir aquí; caller maneja
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

    const token = await this.ensureToken().catch(() => null);
    if (token) config.headers['Authorization'] = `Bearer ${token}`;

    let res = await fetch(url, config);

    if (res.status === 401 && !options._retry) {
      await this._refreshToken();
      return this.request(endpoint, { ...options, _retry: true });
    }

    if (!res.ok) {
      let errData;
      try {
        errData = await res.json();
      } catch {
        errData = {};
      }
      throw new Error(errData.message || `Error ${res.status}`);
    }

    return res.json();
  }

  get = (endpoint) => this.request(endpoint, { method: 'GET' });
  post = (endpoint, data) => this.request(endpoint, { method: 'POST', body: JSON.stringify(data) });
  put = (endpoint, data) => this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) });
  delete = (endpoint) => this.request(endpoint, { method: 'DELETE' });
}

export const api = new ApiClient();