// src/store/ui.store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set, get) => ({
      // Состояние интерфейса
      theme: 'light', // 'light' | 'dark'
      language: 'ru', // 'ru' | 'en'
      currency: 'RUB', // 'RUB' | 'USD' | 'EUR'
      sidebarOpen: true,
      modals: {
        transaction: false,
        category: false,
        budget: false,
        goal: false
      },
      currentModal: null,
      toastNotifications: [],
      isLoading: false,

      // Методы для темы
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        set({ theme: newTheme });
      },

      // Методы для языка
      setLanguage: (lang) => {
        set({ language: lang });
      },

      // Методы для валюты
      setCurrency: (currency) => {
        set({ currency });
      },

      // Методы для боковой панели
      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }));
      },
      openSidebar: () => {
        set({ sidebarOpen: true });
      },
      closeSidebar: () => {
        set({ sidebarOpen: false });
      },

      // Методы для модальных окон
      openModal: (modalName) => {
        set({ 
          currentModal: modalName,
          modals: { ...get().modals, [modalName]: true }
        });
      },
      closeModal: (modalName) => {
        set({ 
          currentModal: null,
          modals: { ...get().modals, [modalName]: false }
        });
      },
      closeAllModals: () => {
        set({ 
          currentModal: null,
          modals: {
            transaction: false,
            category: false,
            budget: false,
            goal: false
          }
        });
      },

      // Методы для уведомлений
      addToast: (notification) => {
        const id = Date.now();
        set(state => ({
          toastNotifications: [
            ...state.toastNotifications,
            { ...notification, id }
          ]
        }));
        
        // Автоматическое удаление через 5 секунд
        if (!notification.persist) {
          setTimeout(() => {
            get().removeToast(id);
          }, 5000);
        }
        
        return id;
      },
      removeToast: (id) => {
        set(state => ({
          toastNotifications: state.toastNotifications.filter(n => n.id !== id)
        }));
      },
      clearToasts: () => {
        set({ toastNotifications: [] });
      },

      // Методы для загрузки
      startLoading: () => {
        set({ isLoading: true });
      },
      stopLoading: () => {
        set({ isLoading: false });
      }
    }),
    {
      name: 'ui-settings', // Ключ для localStorage
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        currency: state.currency,
        sidebarOpen: state.sidebarOpen
      }), // Сохраняем только настройки
    }
  )
);

// Инициализация темы при загрузке
const initializeTheme = () => {
  const { theme } = useUIStore.getState();
  document.documentElement.setAttribute('data-theme', theme);
};

// Вызываем инициализацию при загрузке хранилища
initializeTheme();

// Подписка на изменение темы
useUIStore.subscribe(
  (state) => state.theme,
  (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  }
);