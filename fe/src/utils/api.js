import axios from 'axios';
import { getUserDataFromCookie } from './cookie';

const userData = getUserDataFromCookie()

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: userData?.token ? `Bearer ${userData.token}` : '',
  },
  withCredentials: false, 
});

api.interceptors.response.use(
  (response) => {
    return response; 
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error); 
  }
);

export default api;