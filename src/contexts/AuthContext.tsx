import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth';

interface UserData {
  id: string;
  email: string;
  displayName?: string;
  userName?: string;
  preferences: {
    notifications: boolean;
  };
  createdAt: Date;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<Omit<UserData, 'id' | 'email' | 'createdAt'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const isValid = authService.verifyToken(storedToken);
          if (isValid) {
            const userData = await authService.getCurrentUser(storedToken);
            if (userData) {
              setUser(userData);
              setToken(storedToken);
            } else {
              localStorage.removeItem('authToken');
            }
          } else {
            localStorage.removeItem('authToken');
          }
        } catch (err) {
          console.error('Auth initialization error:', err);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signup = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user: userData, token: newToken } = await authService.signup(email, password);
      setUser(userData);
      setToken(newToken);
      localStorage.setItem('authToken', newToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user: userData, token: newToken } = await authService.login(email, password);
      setUser(userData);
      setToken(newToken);
      localStorage.setItem('authToken', newToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      localStorage.removeItem('authToken');
      setUser(null);
      setToken(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<Omit<UserData, 'id' | 'email' | 'createdAt'>>) => {
    if (!user || !token) throw new Error('No user logged in');
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await authService.updateUser(user.id, updates);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    signup,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};