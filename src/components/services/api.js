// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

class ApiService {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('access_token');
    
    const config = {
      ...options,
      headers: {
        ...options.headers,
      },
    };

    // Add auth token if available
    if (token && !options.skipAuth) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add Content-Type for JSON requests
    if (options.body && !(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    try {      
      const response = await fetch(`${API_URL}${endpoint}`, config);

      // Handle token refresh if unauthorized
      if (response.status === 401 && !options.skipRefresh) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          return this.request(endpoint, { ...options, skipRefresh: true });
        } else {
          throw new Error('Session expired. Please login again.');
        }
      }

      // ✅ Handle 204 No Content (successful DELETE with no body)
      if (response.status === 204) {
        return { success: true, message: 'Operation successful' };
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ 
          detail: `HTTP ${response.status}: ${response.statusText}` 
        }));
        throw new Error(error.detail || error.error || 'Request failed');
      }

      // ✅ Check if there's JSON content to parse
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      // ✅ No JSON content, return success
      return { success: true };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth Methods
  async login(email, password) {
    const data = await this.request('/token/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });

    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);

    // Get user data - Use correct endpoint
    const user = await this.getCurrentUser();
    return { user, tokens: data };
  }

  async register(userData) {
    // POST /accounts/users/
    const data = await this.request('/accounts/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
      skipAuth: true,
    });

    // If backend returns tokens on registration, save them
    if (data.access) {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      const user = await this.getCurrentUser();
      return { user, tokens: data };
    }

    return data;
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const data = await this.request('/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
        skipAuth: true,
      });

      localStorage.setItem('access_token', data.access);
      return true;
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return false;
    }
  }

  async getCurrentUser() {
    // GET /accounts/users/ - Returns current authenticated user
    return this.request('/accounts/users/');
  }

  async logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Analysis Methods
  async uploadAndAnalyze(imageFile, name = '') {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (name) formData.append('name', name);

    // POST /compliance/analyses/
    return this.request('/compliance/analyses/', {
      method: 'POST',
      body: formData,
    });
  }

  async getAnalyses() {
    // GET /compliance/analyses/
    return this.request('/compliance/analyses/');
  }

  async getAnalysis(id) {
    // GET /compliance/analyses/{id}/
    return this.request(`/compliance/analyses/${id}/`);
  }

  async deleteAnalysis(id) {
    // DELETE /compliance/analyses/{id}/
    return this.request(`/compliance/analyses/${id}/`, {
      method: 'DELETE',
    });
  }

  async getStatistics() {
    // GET /compliance/analyses/statistics/
    return this.request('/compliance/analyses/statistics/');
  }

  // Health Check
  async healthCheck() {
    // GET /compliance/health/
    return this.request('/compliance/health/', { skipAuth: true });
  }
}

const api = new ApiService();
export default api;
