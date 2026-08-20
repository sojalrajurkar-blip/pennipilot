import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Standardize error payload returned from GlobalExceptionHandler
    const errorResponse = error.response?.data || {
      message: error.message || 'An unexpected network error occurred',
      error: 'NETWORK_ERROR',
      status: error.response?.status || 500,
    };
    return Promise.reject(errorResponse);
  }
);

export default axiosClient;
