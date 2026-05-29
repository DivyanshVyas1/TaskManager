import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a global interceptor to always attach the token to backend requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // Only attach token if the request is going to our backend
  const apiUrl = import.meta.env.VITE_API_URL;
  if (token && (config.url.startsWith(apiUrl) || config.url.startsWith('/api'))) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Global response interceptor for 401 Unauthorized on backend requests
axios.interceptors.response.use(
  response => response,
  error => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const isBackendRequest = error.config && (error.config.url.startsWith(apiUrl) || error.config.url.startsWith('/api'));
    if (isBackendRequest && error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const register = async (username, email, password) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/register`, { username, email, password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
