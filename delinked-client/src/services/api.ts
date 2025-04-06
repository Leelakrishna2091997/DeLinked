import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  getNonce: async (address: string) => {
    const response = await api.get(`/auth/nonce/${address}`);
    return response.data;
  },
  
  authenticate: async (address: string, signature: string, nonce: string, userType?: string) => {
    const response = await api.post('/auth/authenticate', {
      address,
      signature,
      nonce,
      userType
    });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Organizer API
export const organizerAPI = {
  getProfile: async () => {
    const response = await api.get('/organizers/profile');
    return response.data;
  },
  
  updateProfile: async (profileData: any) => {
    const response = await api.put('/organizers/profile', profileData);
    return response.data;
  }
};

// Candidate API
export const candidateAPI = {
  getProfile: async () => {
    const response = await api.get('/candidates/profile');
    return response.data;
  },
  
  updateProfile: async (profileData: any) => {
    const response = await api.put('/candidates/profile', profileData);
    return response.data;
  }
};

export default api;