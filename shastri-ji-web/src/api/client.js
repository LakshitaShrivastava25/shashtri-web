import axios from 'axios';

const ACCESS_KEY = 'shastri_access';
const REFRESH_KEY = 'shastri_refresh';

export const tokenStorage = {
  getAccess() {
    return localStorage.getItem(ACCESS_KEY);
  },
  getRefresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  setTokens(access, refresh) {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({ baseURL });

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

async function performRefresh() {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) throw new Error('No refresh token');
  const response = await axios.post(`${baseURL}/auth/token/refresh/`, { refresh });
  const access = response.data?.access;
  const newRefresh = response.data?.refresh;
  if (!access) throw new Error('No access token returned');
  tokenStorage.setTokens(access, newRefresh || refresh);
  return access;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status === 401 && original && !original._retry) {
      original._retry = true;
      try {
        if (!refreshPromise) refreshPromise = performRefresh();
        const newAccess = await refreshPromise;
        refreshPromise = null;
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(original);
      } catch (refreshError) {
        refreshPromise = null;
        tokenStorage.clear();
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
