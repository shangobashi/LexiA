import * as React from 'react';
import { createContext, useState, useEffect, ReactNode } from 'react';

// Types
export type User = {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  microsoftLogin: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
};

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Always provide a mock user for development
  const [user] = useState<User | null>({
    id: 'dev_user_123',
    email: 'dev@example.com',
    displayName: 'Development User',
    photoURL: null
  });
  const loading = false;

  // Rest of the auth functions remain the same
  const login = async (email: string, password: string) => {
    // No-op for development
    console.log('Login attempted:', email);
  };
  
  const register = async (email: string, password: string, name: string) => {
    // No-op for development
    console.log('Register attempted:', email, name);
  };
  
  const logout = async () => {
    // No-op for development
    console.log('Logout attempted');
  };
  
  const googleLogin = async () => {
    // No-op for development
    console.log('Google login attempted');
  };
  
  const microsoftLogin = async () => {
    // No-op for development
    console.log('Microsoft login attempted');
  };
  
  const resetPassword = async (email: string) => {
    // No-op for development
    console.log('Password reset attempted:', email);
  };
  
  const updateProfile = async (data: Partial<User>) => {
    // No-op for development
    console.log('Profile update attempted:', data);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    googleLogin,
    microsoftLogin,
    resetPassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};