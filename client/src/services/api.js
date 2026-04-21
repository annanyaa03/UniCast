import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api',
  withCredentials: true,
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('unicast_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        localStorage.setItem('unicast_token', data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('unicast_token');
        window.location.href = '/login';
      }
    }
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again.');
    }
    return Promise.reject(error);
  }
);

export default api;
