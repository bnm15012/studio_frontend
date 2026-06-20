import axios from 'axios';
import { BASE_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers['Authorization'] = token;
  config.headers['User-Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response ? error.response.status : null;
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest._retryCount = 0;
      while (originalRequest._retryCount < 5) {
        originalRequest._retryCount++;
        try {
          const token = await AsyncStorage.getItem('token');
          const email = await AsyncStorage.getItem('userEmail');
          if (token && email) {
            const response = await axios.post(`${BASE_URL}/password/refreshToken`, {
              token: token.replace('Bearer ', ''),
              email,
            });
            const newToken = `Bearer ${response.data.data[0]}`;
            await AsyncStorage.setItem('token', newToken);
            originalRequest.headers['Authorization'] = newToken;
            return axios(originalRequest);
          }
        } catch (e) {
          if (originalRequest._retryCount >= 5) {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userEmail');
            return Promise.reject(e);
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
