// src/store/history.store.js
import { create } from 'zustand';
import { useAuthStore } from './auth.store';

export const useHistoryStore = create((set, get) => ({
  // Состояние
  history: [],
  filteredHistory: [],
  isLoading: false,
  error: null,
  
  // Фильтры
  filters: {
    actionType: null,     // Тип действия (ADD/UPDATE/DELETE)
    entityType: null,     // Сущность (TRANSACTION/CATEGORY/etc)
    dateRange: 'month',   // Период (week/month/year/all)
    startDate: null,      // Начальная дата для кастомного диапазона
    endDate: null         // Конечная дата
  },

  // Методы
  fetchHistory: async () => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const queryParams = new URLSearchParams({
        ...(filters.actionType && { actionType: filters.actionType }),
        ...(filters.entityType && { entityType: filters.entityType }),
        dateRange: filters.dateRange,
        ...(filters.startDate && { startDate: filters.startDate.toISOString() }),
        ...(filters.endDate && { endDate: filters.endDate.toISOString() })
      });

      const response = await fetch(`http://localhost:4444/api/history?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки истории');
      }

      const history = await response.json();
      
      set({
        history,
        filteredHistory: history,
        isLoading: false,
      });
    } catch (error) {
      console.error('Fetch history error:', error);
      set({
        error: error.message || 'Ошибка загрузки истории',
        isLoading: false,
      });
    }
  },

  // Добавление действия в историю (вызывается из других хранилищ)
  addAction: (action) => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    const newAction = {
      ...action,
      timestamp: new Date().toISOString(),
      userId: useAuthStore.getState().user.id
    };

    // Оптимистичное обновление UI
    set(state => ({
      history: [newAction, ...state.history],
      filteredHistory: [newAction, ...state.filteredHistory]
    }));

    // Отправка на сервер
    fetch('http://localhost:4444/api/history/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newAction),
    }).catch(error => {
      console.error('Failed to save history action:', error);
      // Откатываем изменения при ошибке
      set(state => ({
        history: state.history.filter(a => a.timestamp !== newAction.timestamp),
        filteredHistory: state.filteredHistory.filter(a => a.timestamp !== newAction.timestamp)
      }));
    });
  },

  // Отмена действия (если возможно)
  undoAction: async (actionId) => {
    const { token } = useAuthStore.getState();
    if (!token) return false;

    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:4444/api/history/undo', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({id:actionId})
      });

      if (!response.ok) {
        throw new Error('Невозможно отменить это действие');
      }

      // Обновляем локальное состояние
      const undoneAction = await response.json();
      console.log(undoneAction)
      set(state => ({
        history: state.history.filter(a => a.id !== actionId),
        filteredHistory: state.filteredHistory.filter(a => a.id !== actionId),
        isLoading: false
      }));

      return true;
    } catch (error) {
      console.error('Undo action error:', error);
      set({
        error: error.message || 'Ошибка отмены действия',
        isLoading: false,
      });
      return false;
    }
  },

  // Применение фильтров
  setFilter: (filterName, value) => {
    set(state => ({
      filters: { ...state.filters, [filterName]: value },
    }));
    get().applyFilters();
  },

  applyFilters: () => {
    const { history, filters } = get();
    
    let filtered = [...history];

    // Фильтрация по типу действия
    if (filters.actionType) {
      filtered = filtered.filter(a => a.type === filters.actionType);
    }

    // Фильтрация по типу сущности
    if (filters.entityType) {
      filtered = filtered.filter(a => {
        const entityMap = {
          TRANSACTION: 'Transaction',
          CATEGORY: 'Category',
          BUDGET: 'Budget',
          GOAL: 'Goal'
        };
        return a.entityType === entityMap[filters.entityType];
      });
    }

    // Фильтрация по дате
    if (filters.dateRange === 'custom' && filters.startDate && filters.endDate) {
      filtered = filtered.filter(a => {
        const date = new Date(a.timestamp);
        return date >= filters.startDate && date <= filters.endDate;
      });
    } else if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(a => new Date(a.timestamp) >= startDate);
    }

    set({ filteredHistory: filtered });
  },
}));

// Автоматическая загрузка истории при авторизации
useAuthStore.subscribe(
  (state) => state.isAuth,
  (isAuth) => {
    if (isAuth) {
      useHistoryStore.getState().fetchHistory();
    } else {
      useHistoryStore.setState({ 
        history: [],
        filteredHistory: []
      });
    }
  }
);