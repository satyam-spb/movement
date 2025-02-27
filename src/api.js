import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

// Token management
let getTokenCallback = null;

export const setTokenGetter = (callback) => {
  getTokenCallback = callback;
};

// Request interceptor
api.interceptors.request.use(async (config) => {
  try {
    if (getTokenCallback) {
      const token = await getTokenCallback();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;