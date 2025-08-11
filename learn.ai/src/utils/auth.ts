export const AUTH_TOKEN_KEY = 'skillpath_auth_token';
export const USER_DATA_KEY = 'skillpath_user_data';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface AuthResponse {
  success: boolean;
  data?: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      isActive: boolean;
      lastLogin: string;
      emailVerified: boolean;
      createdAt: string;
    };
  };
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  lastLogin: string;
  emailVerified: boolean;
  createdAt: string;
}

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error');
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
    }

    return response;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Sign in failed'
    };
  }
};

export const signUp = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (response.success && response.data) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
    }

    return response;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Sign up failed'
    };
  }
};

export const signOut = async (): Promise<void> => {
  try {
    // Call logout endpoint to invalidate token on server (if needed)
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (error) {
    // Continue with logout even if server call fails
    console.warn('Logout server call failed:', error);
  } finally {
    // Always clear local storage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem(USER_DATA_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const user = getCurrentUser();
  
  return !!(token && user && user.isActive);
};

export const refreshUserData = async (): Promise<User | null> => {
  try {
    const response = await apiRequest('/auth/me');
    
    if (response.success && response.data?.user) {
      const user = response.data.user;
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Error refreshing user data:', error);
    // If token is invalid, clear storage
    if (error instanceof Error && error.message.includes('token')) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
    }
    return null;
  }
};

export const updateProfile = async (updates: { name?: string; avatar?: string }): Promise<AuthResponse> => {
  try {
    const response = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    if (response.success && response.data?.user) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
    }

    return response;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Profile update failed'
    };
  }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<AuthResponse> => {
  try {
    const response = await apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    return response;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Password change failed'
    };
  }
};