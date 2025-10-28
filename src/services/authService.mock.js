// Auth Service with Mock Support
import mockApiService from '../mocks/mockApiService';
import { isMockMode } from '../config/apiConfig';

const authServiceMock = {
  async login(credentials) {
    if (isMockMode()) {
      return mockApiService.login(credentials);
    }
    // Real API call would go here
    throw new Error('Real API not implemented yet');
  },

  async register(userData) {
    if (isMockMode()) {
      return mockApiService.register(userData);
    }
    throw new Error('Real API not implemented yet');
  },

  async logout() {
    if (isMockMode()) {
      return mockApiService.logout();
    }
    throw new Error('Real API not implemented yet');
  },
};

export default authServiceMock;

