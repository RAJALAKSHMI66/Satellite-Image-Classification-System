import React, { createContext, useContext, useState } from 'react';

interface User {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface UserContextType {
  user: User;
  isLoggedIn: boolean;
  login: (userData?: { name: string; email: string }) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const defaultUser: User = {
  name: 'Dr. Sarah Chen',
  email: 'sarah.chen@satellite.ai',
  avatar: 'SC',
  role: 'Senior Research Scientist',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>(defaultUser);

  const login = (userData?: { name: string; email: string }) => {
    if (userData) {
      setUser({
        name: userData.name,
        email: userData.email,
        avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        role: 'Research Scientist',
      });
    }
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(defaultUser);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
