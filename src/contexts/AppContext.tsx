import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  role: 'admin' | 'user';
};

type AppContextType = {
  currentLang: 'en' | 'hi';
  toggleLanguage: () => void;
  user: User | null;
  isLoggedIn: boolean; // <-- Add this line
  login: (email: string, password: string, role: 'admin' | 'user') => void;
  logout: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en');
  const [user, setUser] = useState<User | null>(null);

  const toggleLanguage = () => {
    setCurrentLang(currentLang === 'en' ? 'hi' : 'en');
  };

  const login = (email: string, password: string, role: 'admin' | 'user') => {
    // In a real application, we would validate credentials against a backend
    // For this demo, we'll just set a mock user
    setUser({
      id: '1',
      name: email.split('@')[0],
      role,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    currentLang,
    toggleLanguage,
    user,
    isLoggedIn: !!user, // <-- Add this line
    login,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
