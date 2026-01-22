import { apiCall, setAuthToken } from './api.js';

// User registration
export const registerUser = async (userData) => {
  return apiCall('/felhasznalo/register', {
    method: 'POST',
    body: userData,
    includeAuth: false
  });
};

// User login
export const loginUser = async (credentials) => {
  const response = await apiCall('/felhasznalo/login', {
    method: 'POST',
    body: credentials,
    includeAuth: false
  });

  // If login successful, store token
  if (response.success && response.data?.token) {
    setAuthToken(response.data.token);
  }

  return response;
};

// Get current user
export const getCurrentUser = async () => {
  return apiCall('/user');
};

// Logout user
export const logoutUser = () => {
  setAuthToken(null);
  return {
    success: true,
    message: 'Sikeresen kijelentkeztél'
  };
};

// Get user by ID
export const getUserById = async (id) => {
  return apiCall(`/felhasznalo/${id}`);
};

// Get user's groups
export const getUserGroups = async (id) => {
  return apiCall(`/felhasznalo/${id}/csoportjai`);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token');
};

// Get stored user info from localStorage
export const getStoredUserInfo = () => {
  const userInfo = localStorage.getItem('user_info');
  return userInfo ? JSON.parse(userInfo) : null;
};

// Store user info in localStorage
export const setStoredUserInfo = (userInfo) => {
  if (userInfo) {
    localStorage.setItem('user_info', JSON.stringify(userInfo));
  } else {
    localStorage.removeItem('user_info');
  }
};
