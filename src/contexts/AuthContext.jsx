import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasCodeAccess, setHasCodeAccess] = useState(false);

  useEffect(() => {
    // Check if user has code access from localStorage
    const codeAccess = localStorage.getItem('codeAccess');
    if (codeAccess === 'true') {
      setHasCodeAccess(true);
    }
    setLoading(false);
  }, []);

  const verifyCode = (code) => {
    if (code === '2580') {
      setHasCodeAccess(true);
      localStorage.setItem('codeAccess', 'true');
      toast.success('Access granted! You can now upload reviews.');
      return true;
    } else {
      toast.error('Invalid access code');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setHasCodeAccess(false);
    localStorage.removeItem('codeAccess');
    toast.success('Logged out successfully!');
  };

  const value = {
    user,
    profile,
    loading,
    hasCodeAccess,
    verifyCode,
    logout,
    isAdmin: false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};