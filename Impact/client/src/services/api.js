import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
};

// Client Auth API
export const clientAuthAPI = {
  login: (credentials) => api.post('/client/auth/login', credentials),
  verify: () => api.get('/client/auth/verify'),
};

// Students API
export const studentsAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  search: (query) => api.get(`/students/search/${query}`),
};

// Payments API
export const paymentsAPI = {
  getAll: () => api.get('/payments'),
  getByStudent: (studentId) => api.get(`/payments/student/${studentId}`),
  create: (data) => api.post('/payments', data),
  updateStatus: (id, status) => api.put(`/payments/${id}/status`, { status }),
  delete: (id) => api.delete(`/payments/${id}`),
};

// Workouts API
export const workoutsAPI = {
  getAll: () => api.get('/workouts'),
  update: (studentId, data) => api.put(`/workouts/${studentId}`, data),
  delete: (studentId) => api.delete(`/workouts/${studentId}`),
};

// Client Data API
export const clientDataAPI = {
  getProfile: () => api.get('/client/profile'),
  getPayments: () => api.get('/client/payments'),
  getWorkout: () => api.get('/client/workout'),
  getMeasurements: () => api.get('/client/measurements'),
  getProgress: () => api.get('/client/progress'),
};

export default api;
