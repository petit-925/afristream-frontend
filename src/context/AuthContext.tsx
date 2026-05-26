import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { ACCESS_TOKEN_KEY, getMe, login as apiLogin, register as apiRegister } from '../api';
import type { AuthUser } from '../types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshMe: async () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      if (typeof window === 'undefined' || !('localStorage' in window)) return null;
      const cachedUser = window.localStorage.getItem('auth_user');
      return cachedUser ? JSON.parse(cachedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    try {
      if (typeof window === 'undefined' || !('localStorage' in window)) return null;
      return window.localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  const persist = useCallback((nextToken: string, nextUser: AuthUser) => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        window.localStorage.setItem(ACCESS_TOKEN_KEY, nextToken);
        window.localStorage.setItem('auth_user', JSON.stringify(nextUser));
      }
    } catch {}
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const clear = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        window.localStorage.removeItem(ACCESS_TOKEN_KEY);
        window.localStorage.removeItem('auth_user');
      }
    } catch {}
    setToken(null);
    setUser(null);
  }, []);

  const refreshMe = useCallback(async () => {
    try {
      if (typeof window === 'undefined' || !('localStorage' in window)) {
        setLoading(false);
        return;
      }
      if (!window.localStorage.getItem(ACCESS_TOKEN_KEY)) {
        setLoading(false);
        return;
      }
    } catch {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { user } = await getMe();
      setUser(user);
      try {
        if (typeof window !== 'undefined' && 'localStorage' in window) {
          window.localStorage.setItem('auth_user', JSON.stringify(user));
        }
      } catch {}
    } catch {
      clear();
    } finally {
      setLoading(false);
    }
  }, [clear]);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken, user } = await apiLogin({ email, password });
    persist(accessToken, user);
  }, [persist]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { accessToken, user } = await apiRegister({ name, email, password });
    persist(accessToken, user);
  }, [persist]);

  const logout = useCallback(() => {
    clear();
    try {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch {}
  }, [clear]);

  useEffect(() => {
    // Only refresh if we don't have a user but we have a token
    if (!user && token) {
      refreshMe();
    } else if (!user && !token) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, token, refreshMe]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshMe
  }), [user, token, loading, login, register, logout, refreshMe]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
