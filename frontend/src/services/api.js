import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'bypass-tunnel-reminder': 'true' }
});

// Agregar token JWT a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Si el token expira redirigir al login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authService = {
  login: (username, password) => api.post('/auth/login', { username, password })
};

export const mapaService = {
  getEstados: () => api.get('/mapa/estados'),
  getInfoFederal: () => api.get('/mapa/info-federal'),
  getInfoEstatal: (estado) => api.get(`/mapa/info-estatal/${estado}`),
  getPlantelesByEstado: (estado) => api.get(`/mapa/planteles/${estado}`),
  getPlantelById: (id) => api.get(`/mapa/plantel/${id}`),
  getMatriculaNacional: () => api.get('/matricula/nacional'),
  getMatriculaNacional20252026: () => api.get('/matricula/nacional-2025-2026'),
  getMatriculaPorPlantel: (colegio) => api.get('/matricula/por-plantel', { params: colegio ? { colegio } : {} }),
  getIndicadoresNacionales: () => api.get('/indicadores/nacionales'),
  getIndicadoresPorPlantel: (colegio) => api.get('/indicadores/por-plantel', { params: colegio ? { colegio } : {} }),
  getDocentesPorEstado: () => api.get('/docentes/por-estado'),
  getDocentesPorPlantel: (colegio) => api.get('/docentes/por-plantel', { params: colegio ? { colegio } : {} }),
  getOfertaNacional: () => api.get('/oferta/nacional'),
  getOfertaPorPlantel: (colegio) => api.get('/oferta/por-plantel', { params: colegio ? { colegio } : {} }),
  getAnexos: () => api.get('/anexos')
};
