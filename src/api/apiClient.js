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

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  redirectToLogin() {
    this.clearTokens();
    window.location.replace('/login');
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
      this.redirectToLogin();
      throw err;
    }
    return token;
  }

  async _refreshToken() {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      console.warn('No refresh token available - redirecting to login');
      this.redirectToLogin();
      throw new Error('No refresh token available');
    }

    try {
      const res = await fetch(`${this.baseURL}/auth/refreshToken`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('Refresh failed:', errData.message);
        this.redirectToLogin();
        throw new Error(errData.message || 'Refresh failed');
      }

      const { accessToken, refreshToken: newRefreshToken } = await res.json();

      if (!accessToken) {
        this.redirectToLogin();
        throw new Error('No access token in response');
      }

      this.setTokens(accessToken, newRefreshToken || refreshToken);

      console.log('Token refreshed successfully');
      return accessToken;
    } catch (err) {
      this.redirectToLogin();
      throw err;
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

    // === RUTAS PÚBLICAS: NO requieren token ni refresh ===
    const publicEndpoints = [
      '/auth/login',
      '/auth/register',
      '/auth/refreshToken'
    ];
    const isPublic = publicEndpoints.some(path => endpoint.startsWith(path));

    if (!isPublic) {
      const token = await this.ensureToken().catch(() => {
        this.redirectToLogin();
        return null;
      });
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    let res = await fetch(url, config);

    // === MANEJO DE 401 ===
    if (res.status === 401 && !options._retry) {
      // Si es login o register → NO intentar refresh, solo devolver error
      if (endpoint.startsWith('/auth/login') || endpoint.startsWith('/auth/register')) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Credenciales inválidas');
      }

      // Si es refreshToken fallido → redirigir
      if (endpoint.includes('refreshToken')) {
        this.redirectToLogin();
        throw new Error('Sesión expirada');
      }

      // Para cualquier otra ruta protegida → intentar refresh
      console.log(`Token expired on ${endpoint}, attempting refresh...`);
      try {
        await this._refreshToken();
        return this.request(endpoint, { ...options, _retry: true });
      } catch (err) {
        this.redirectToLogin();
        throw err;
      }
    }

    // === ERRORES GENERALES ===
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