// API configuration - Backend endpoint
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper function to set auth token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

// Helper function to get common headers
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    includeAuth = true,
    customHeaders = {}
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { ...getHeaders(includeAuth), ...customHeaders };

  try {
    const config = {
      method,
      headers
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    // Handle 401 Unauthorized - clear token and redirect to login
    if (response.status === 401) {
      setAuthToken(null);
      window.location.href = '/login';
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: data.message || 'Hiba történt az API hívás során',
        status: response.status
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message || 'Sikeres'
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      data: null,
      message: error.message || 'Hálózati hiba'
    };
  }
};

export default API_BASE_URL;
