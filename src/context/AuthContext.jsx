import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('pennywise_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('pennywise_token') || null);
  const [currency, setCurrency] = useState(() => localStorage.getItem('pennywise_currency') || '₹');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.currency) {
      setCurrency(user.currency);
    }
  }, [user]);

  const saveAuthData = (data) => {
    const userData = {
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      currency: data.currency || '₹',
    };
    setUser(userData);
    setToken(data.token);
    setCurrency(data.currency || '₹');
    localStorage.setItem('pennywise_token', data.token);
    localStorage.setItem('pennywise_user', JSON.stringify(userData));
    localStorage.setItem('pennywise_currency', data.currency || '₹');
  };

  const login = async (usernameOrEmail, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { usernameOrEmail, password });
      saveAuthData(res.data);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', userData);
      saveAuthData(res.data);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Username or email may already be in use.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/demo');
      saveAuthData(res.data);
      return res.data;
    } catch (err) {
      // Fallback to standard login attempt
      try {
        const fallback = await api.post('/auth/login', { usernameOrEmail: 'demo', password: 'demo123' });
        saveAuthData(fallback.data);
        return fallback.data;
      } catch (err2) {
        const msg = err2.response?.data?.message || 'Demo login failed. Make sure backend is running.';
        setError(msg);
        throw new Error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pennywise_token');
    localStorage.removeItem('pennywise_user');
  };

  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('pennywise_currency', newCurrency);
    if (user) {
      const updated = { ...user, currency: newCurrency };
      setUser(updated);
      localStorage.setItem('pennywise_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        currency,
        updateCurrency,
        loading,
        error,
        login,
        register,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
