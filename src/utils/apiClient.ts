import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_DUMMY_API_BASE_URL;

console.log('API_BASE_URL', import.meta.env.VITE_DUMMY_API_BASE_URL);
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'API request failed';
      throw new Error(message);
    }
    throw error;
  }
);
