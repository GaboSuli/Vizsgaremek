import axios from 'axios';

// API configuration - Backend endpoint
const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper function to set auth token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
    // Add token to axios default headers
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('auth_token');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    includeAuth = true,
    customHeaders = {}
  } = options;

  try {
    const config = {
      method,
      headers: customHeaders
    };

    if (body) {
      config.data = body;
    }

    // If auth is not needed, create temporary instance without auth
    const instance = includeAuth ? axiosInstance : axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...customHeaders
      }
    });

    const response = await instance(endpoint, config);

    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Sikeres'
    };
  } catch (error) {
    console.error('API Error:', error);

    // Handle network errors
    if (!error.response) {
      if (!navigator.onLine) {
        return {
          success: false,
          data: null,
          message: '❌ Backend szerver nem elérhető!\n\nEllenőrizd:\n1. Backend fut-e? (php artisan serve)\n2. A port 8000-en hallgatja-e?\n3. Nyitva van-e a Backend terminál?\n\nQUICK_START.md fájl olvasásához kattints a projekt gyökerében',
          status: 503
        };
      }

      return {
        success: false,
        data: null,
        message: `Hálózati hiba: ${error.message}`,
        status: 0
      };
    }

    // Handle HTTP error responses
    return {
      success: false,
      data: null,
      message: error.response.data?.message || 'Hiba történt az API hívás során',
      status: error.response.status
    };
  }
};

export default API_BASE_URL;
