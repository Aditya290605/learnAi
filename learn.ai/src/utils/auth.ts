export const AUTH_TOKEN_KEY = 'skillpath_auth_token';

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  error?: string;
}

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (email === 'demo@skillpath.com' && password === 'password') {
    const token = 'mock_jwt_token_' + Date.now();
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    
    return {
      success: true,
      token,
      user: {
        id: '1',
        name: 'Alex Johnson',
        email: 'demo@skillpath.com'
      }
    };
  }
  
  return {
    success: false,
    error: 'Invalid email or password'
  };
};

export const signUp = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const token = 'mock_jwt_token_' + Date.now();
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  
  return {
    success: true,
    token,
    user: {
      id: '2',
      name,
      email
    }
  };
};

export const signOut = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};