import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getTelegramInitData } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTelegramEnvironment, setIsTelegramEnvironment] = useState(false);

  useEffect(() => {
    async function initAuth() {
      try {
        // Initialize Telegram WebApp SDK if present
        if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
          const tg = window.Telegram.WebApp;
          tg.ready();
          tg.expand();
          if (tg.setHeaderColor) tg.setHeaderColor('#090d16');
          if (tg.setBackgroundColor) tg.setBackgroundColor('#090d16');
          if (tg.enableClosingConfirmation) tg.enableClosingConfirmation();
          setIsTelegramEnvironment(Boolean(tg.initData));
        }

        // Verify with backend
        const response = await authApi.verify();
        if (response.success && response.user) {
          setUser(response.user);
        }
      } catch (err) {
        console.warn('Auth initialization fallback (dev/mock mode enabled):', err.message);
        // Fallback for browser preview mode
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        if (tgUser) {
          setUser({
            telegramId: String(tgUser.id),
            firstName: tgUser.first_name || 'Telegram User',
            lastName: tgUser.last_name || '',
            username: tgUser.username || '',
            isAdmin: false,
            isDevMock: true
          });
        } else {
          setUser({
            telegramId: '999999999',
            firstName: 'Preview',
            lastName: 'User',
            username: 'preview_user',
            isAdmin: false,
            isDevMock: true
          });
        }
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error, isTelegramEnvironment }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
