// src/store/auth.store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Состояние
      user: null,
      token: null,
      isAuth: false,
      isLoading: false,
      error: null,
      isSuccesReset: false,

      // Методы
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('http://localhost:4444/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка входа');
          }

          const { token, user } = await response.json();

          set({
            user,
            token,
            isAuth: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          console.error('Login error:', error);
          set({
            error: error.message || 'Ошибка входа',
            isLoading: false,
          });
          return false;
        }
      },

      register: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('http://localhost:4444/api/auth/registration', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка регистрации');
          }

          const { token, user } = await response.json();

          set({
            user,
            token,
            isAuth: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          console.error('Register error:', error);
          set({
            error: error.message || 'Ошибка регистрации',
            isLoading: false,
          });
          return false;
        }
      },

      logout: async() => {
        const { token } = get();
        try {
          const response = await fetch('http://localhost:4444/api/auth/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка выхода');
          }

          set({
            user: null,
            token: null,
            isAuth: false,
          });

          return true;
        } catch (error) {
          console.error('Login error:', error);
          set({
            error: error.message || 'Ошибка выхода',
            isLoading: false,
          });
          return false;
        }
      },

      resetPassword: async (email) => {
        set({ isLoading: true, error: null, isSuccesReset: false });
        try {
          const response = await fetch('http://localhost:3000/api/auth/reset-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка сброса пароля');
          }

          set({ isLoading: false, isSuccesReset: true });
          return true;
        } catch (error) {
          console.error('Reset password error:', error);
          set({
            error: error.message || 'Ошибка сброса пароля',
            isLoading: false,
            isSuccesReset: false
          });
          return false;
        }
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return false;

        set({ isLoading: true });
        try {
          const response = await fetch('http://localhost:4444/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Сессия истекла');
          }

          const user = await response.json();
          set({
            user,
            isAuth: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          console.error('Auth check error:', error);
          set({
            user: null,
            token: null,
            isAuth: false,
            isLoading: false,
          });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage', // Ключ для localStorage
      partialize: (state) => ({ token: state.token }), // Сохраняем только токен
    }
  )
);

// Инициализация проверки аутентификации при загрузке
useAuthStore.getState().checkAuth();