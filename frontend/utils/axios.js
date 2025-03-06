// utils/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Refresh token
      const refreshToken = localStorage.getItem('refresh_token');
      const { data } = await axios.post('/api/auth/refresh/', {
        refresh: refreshToken
      });
      
      localStorage.setItem('access_token', data.access);
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

export default api;