import axios from 'axios';

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

adminApi.interceptors.request.use((config) => {
  // Le token admin est stocké par zustand persist sous 'tutorlink-admin-auth'
  try {
    const raw = localStorage.getItem('tutorlink-admin-auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      const token = parsed?.state?.adminToken;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore
  }
  return config;
});

export default adminApi;
