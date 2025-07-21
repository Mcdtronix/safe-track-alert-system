
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('vtps_user');
    const token = localStorage.getItem('vtps_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      api.setToken(token);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // The backend expects 'username', not 'email'
      const res = await api.post<{ token: string; user: User }>('/auth/login/', { username: email, password });
      api.setToken(res.token);
      setUser(res.user);
      localStorage.setItem('vtps_user', JSON.stringify(res.user));
      localStorage.setItem('vtps_token', res.token);
      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post('/auth/logout/');
    } catch {}
    setUser(null);
    api.clearToken();
    localStorage.removeItem('vtps_user');
    localStorage.removeItem('vtps_token');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
