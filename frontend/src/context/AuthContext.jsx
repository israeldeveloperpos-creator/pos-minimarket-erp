import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay token guardado
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token');
    if (tokenGuardado) {
      setToken(tokenGuardado);
      verificarUsuario(tokenGuardado);
    } else {
      setLoading(false);
    }
  }, []);

  const verificarUsuario = async (token) => {
    try {
      const response = await authAPI.me();
      setUsuario(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al verificar usuario:', err);
      localStorage.removeItem('token');
      setToken(null);
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);
      const { token, usuario } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUsuario(usuario);
      setError(null);
      return true;
    } catch (err) {
      const message = err.response?.data?.error || 'Error al iniciar sesión';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUsuario(null);
      setError(null);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, token, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
