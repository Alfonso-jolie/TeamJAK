import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import { getCurrentUserData } from '../../firebase/auth';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);

    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, get additional data from Firestore
        getCurrentUserData(firebaseUser.uid).then((userData) => {
          const sessionData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            ...userData,
            loggedInAt: new Date().toISOString(),
          };
          setUser(sessionData);
          authService.setSession(sessionData);
        });
      } else {
        // User is signed out
        setUser(null);
        authService.clearSession();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const result = await authService.login(email, password);
    if (result.success) {
      setUser(result.user);
    }
    setLoading(false);
    return result;
  };

  const register = async (userData) => {
    setLoading(true);
    const result = await authService.register(userData);
    if (result.success) {
      setUser(result.user);
    }
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    const result = await authService.logout();
    if (result.success) {
      setUser(null);
    }
    setLoading(false);
    return result;
  };

  const resetPassword = async (email) => {
    return await authService.resetPassword(email);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
