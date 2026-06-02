import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:2323',
  timeout: 10000,
  withCredentials: true,
});

// Automatically add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    config.headers = config.headers || {};
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('[Axios] 401 Unauthorized response received', error.response.data);
      localStorage.clear();
      window.location.href = '/Login';
    }
    return Promise.reject(error);
  }
);

export default api;