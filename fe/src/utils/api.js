// import axios from 'axios';

// const token = localStorage.getItem("token")

// const api = axios.create({
//   baseURL: `${import.meta.env.VITE_API_URL}/api`,
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: token ? `Bearer ${token}` : '',
//   },
//   withCredentials: false, 
// });

// api.interceptors.response.use(
//   (response) => {
//     return response; 
//   },
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       window.location.href = '/login';
//     }
//     return Promise.reject(error); 
//   }
// );

// export default api;


// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, 
});

// Add request interceptor to get fresh token for each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response; 
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = '/login';
    }
    return Promise.reject(error); 
  }
);

export default api;