// API Configuration - Toggle between Mock and Real API
import mockApiService from '../mocks/mockApiService';

// Check if we should use mock data
// You can control this via environment variable or manually toggle
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'; // Default to true for development

export const isMockMode = () => USE_MOCK_API;

// API Interceptor - Routes requests to mock or real API
export const createApiInterceptor = (realApiService) => {
  return new Proxy(realApiService, {
    get(target, prop) {
      if (USE_MOCK_API && mockApiService[prop]) {
        return mockApiService[prop].bind(mockApiService);
      }
      return target[prop]?.bind(target);
    },
  });
};

export default {
  isMockMode,
  createApiInterceptor,
};

