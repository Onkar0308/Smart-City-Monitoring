import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/auth';

interface UserPreferences {
  notifications: boolean;
}

interface User {
  id: string;
  email: string;
  displayName?: string;
  userName?: string;
  preferences: UserPreferences;
  createdAt: Date;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const loggedInUser = await authService.login(email, password);
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const newUser = await authService.signup(email, password);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>) => {
    if (!user) return;
    try {
      setIsLoading(true);
      const updatedUser = await authService.updateUser(user.id, updates);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}