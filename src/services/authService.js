import { apiService, API_ENDPOINTS } from './api';

class AuthService {
  // Login user
  async login(email, password) {
    const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return response;
  }

  // Register user
  async register(userData) {
    const response = await apiService.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response;
  }

  // Logout user
  async logout() {
    const response = await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response;
  }

  // Refresh token
  async refreshToken() {
    const response = await apiService.post(API_ENDPOINTS.AUTH.REFRESH);
    return response;
  }

  // Forgot password
  async forgotPassword(email) {
    const response = await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
    });
    return response;
  }

  // Reset password
  async resetPassword(token, password) {
    const response = await apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password,
    });
    return response;
  }

  // Verify email
  async verifyEmail(token) {
    const response = await apiService.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      token,
    });
    return response;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('persist:root');
    if (token) {
      try {
        const parsed = JSON.parse(token);
        const authData = JSON.parse(parsed.auth);
        return authData.isAuthenticated && authData.token;
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  // Get stored token
  getToken() {
    const token = localStorage.getItem('persist:root');
    if (token) {
      try {
        const parsed = JSON.parse(token);
        const authData = JSON.parse(parsed.auth);
        return authData.token;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  // Get stored user
  getUser() {
    const token = localStorage.getItem('persist:root');
    if (token) {
      try {
        const parsed = JSON.parse(token);
        const authData = JSON.parse(parsed.auth);
        return authData.user;
      } catch (error) {
        return null;
      }
    }
    return null;
  }
}

export const authService = new AuthService();
