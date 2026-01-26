import { apiCall, setAuthToken } from './api.js';

// User registration
export const registerUser = async (userData) => {
  const response = await apiCall('/felhasznalo/register', {
    method: 'POST',
    body: userData,
    includeAuth: false
  });
  if (response.success && response.data?.user) {
    // Transform to public data structure
    const publicData = {
      Nev: response.data.user.nev || response.data.user.name,
      Becenev: response.data.user.becenev || response.data.user.name,
      ProfilKepURL: response.data.user.profilkep_url || 'user.png'
    };
    return {
      success: true,
      data: publicData,
      message: 'Felhasználó sikeresen létrehozva'
    };
  }
  return response;
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

// Get user by ID (returns public data)
export const getUserById = async (id) => {
  const response = await apiCall(`/felhasznalo/${id}`);
  if (response.success && response.data) {
    // Transform to public data structure
    const publicData = {
      Nev: response.data.nev || response.data.Nev,
      Becenev: response.data.becenev || response.data.Becenev,
      ProfilKepURL: response.data.profilkep_url || response.data.ProfilKepURL || 'user.png'
    };
    return {
      success: true,
      data: publicData,
      message: 'Felhasználó adatok sikeresen lekérdezve'
    };
  }
  return response;
};

// Update user
export const updateUser = async (id, userData) => {
  const response = await apiCall(`/felhasznalo/${id}`, {
    method: 'PUT',
    body: userData
  });
  if (response.success && response.data) {
    // Transform to public data structure
    const publicData = {
      Nev: response.data.nev || response.data.Nev,
      Becenev: response.data.becenev || response.data.Becenev,
      ProfilKepURL: response.data.profilkep_url || response.data.ProfilKepURL || 'user.png'
    };
    return {
      success: true,
      data: publicData,
      message: 'Felhasználó sikeresen módosítva'
    };
  }
  return response;
};

// Delete user
export const deleteUser = async (id) => {
  const response = await apiCall(`/felhasznalo/${id}`, {
    method: 'DELETE'
  });
  if (response.success) {
    return {
      success: true,
      message: 'Felhasználó sikeresen törölve'
    };
  }
  return response;
};

// Get user's groups
export const getUserGroups = async (id) => {
  return apiCall(`/felhasznalo/${id}/csoportjai`);
};

// Get user data within a specific group
export const getUserInGroup = async (userId, groupId) => {
  const groupsResponse = await getUserGroups(userId);

  if (!groupsResponse.success) {
    return groupsResponse;
  }

  const userGroups = groupsResponse.data;
  const groupData = userGroups.find(group => group.id === parseInt(groupId));

  if (!groupData) {
    return {
      success: false,
      data: null,
      message: 'Felhasználó nem tagja ennek a csoportnak'
    };
  }

  // Extract and format data according to EgyFelhasznaloEgyCsoportAdatai.json
  const userInGroupData = {
    Becenev: groupData.pivot.becenev,
    JogosultsagSzint: groupData.pivot.jogosultsag_szint,
    CsatlakozasDatuma: groupData.pivot.created_at.split('T')[0] // Extract date part
  };

  return {
    success: true,
    data: userInGroupData,
    message: 'Sikeres lekérdezés'
  };
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
