import { create } from 'zustand';
import { useAuthStore } from './auth.store';
import { useCategoriesStore } from './categories.store';
import { useTransactionsStore } from './transactions.store';
import { useHistoryStore } from './history.store';

export const useBudgetStore = create((set, get) => ({
  // Состояние
  monthlyBudget: null,      // Общий месячный бюджет
  categoryLimits: {},       // { categoryId: limit }  {1: 15000,2: 15000}
  spendingByCategory: {},   // { categoryId: spentAmount } {1: 13250, 2: 250,}
  isLoading: false,
  error: null,
  exceededLimits: [],       // Категории, где превышен лимит

  // Методы
  fetchBudgetData: async () => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      // Загружаем общий бюджет
      const [budgetRes, limitsRes] = await Promise.all([
        fetch('http://localhost:4444/api/budget', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:4444/api/budget/limits', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (!budgetRes.ok || !limitsRes.ok) {
        throw new Error('Ошибка загрузки данных бюджета');
      }

      const monthlyBudget = await budgetRes.json();
      const categoryLimits = await limitsRes.json();

      // Рассчитываем потраченные суммы по категориям
      const transactions = useTransactionsStore.getState().transactions;
      const spendingByCategory = calculateSpending(transactions, categoryLimits);

      // Проверяем превышение лимитов
      const exceededLimits = checkExceededLimits(spendingByCategory, categoryLimits);

      set({
        monthlyBudget,
        categoryLimits,
        spendingByCategory,
        exceededLimits,
        isLoading: false
      });

    } catch (error) {
      console.error('Budget fetch error:', error);
      set({
        error: error.message || 'Ошибка загрузки бюджета',
        isLoading: false
      });
    }
  },

  // Установить общий месячный бюджет
  setMonthlyBudget: async (amount) => {
    const { token } = useAuthStore.getState();
    if (!token) return false;

    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:4444/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) {
        throw new Error('Ошибка обновления бюджета');
      }

      const newBudget = await response.json();
      const oldBudget = get().monthlyBudget;
      
      set({ monthlyBudget: newBudget, isLoading: false });

      // Запись в историю
      useHistoryStore.getState().addAction({
        type: 'UPDATE_BUDGET',
        oldData: oldBudget,
        newData: newBudget
      });

      return true;
    } catch (error) {
      console.error('Set budget error:', error);
      set({
        error: error.message || 'Ошибка обновления бюджета',
        isLoading: false
      });
      return false;
    }
  },

  // Установить лимит для категории
  setCategoryLimit: async (categoryId, limit) => {
    const { token } = useAuthStore.getState();
    if (!token) return false;

    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:4444/api/budget/limits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ categoryId, limit })
      });

      if (!response.ok) {
        throw new Error('Ошибка установки лимита');
      }

      const updatedLimit = await response.json();
      const oldLimits = get().categoryLimits;
      const newLimits = { ...oldLimits, [categoryId]: updatedLimit.limit };
      
      // Пересчитываем расходы и превышения
      const transactions = useTransactionsStore.getState().transactions;
      const spendingByCategory = calculateSpending(transactions, newLimits);
      const exceededLimits = checkExceededLimits(spendingByCategory, newLimits);

      set({
        categoryLimits: newLimits,
        spendingByCategory,
        exceededLimits,
        isLoading: false
      });

      // Обновляем категорию (если там есть поле limit)
      useCategoriesStore.getState().updateCategory(categoryId, { limit });

      // Запись в историю
      useHistoryStore.getState().addAction({
        type: 'SET_CATEGORY_LIMIT',
        entityId: categoryId,
        oldData: oldLimits[categoryId],
        newData: updatedLimit.limit
      });

      return true;
    } catch (error) {
      console.error('Set limit error:', error);
      set({
        error: error.message || 'Ошибка установки лимита',
        isLoading: false
      });
      return false;
    }
  },

  // Расчет доступных средств
  getAvailableBudget: () => {
    const { monthlyBudget, spendingByCategory } = get();
    if (!monthlyBudget) return 0;
    
    const totalSpent = Object.values(spendingByCategory)
      .reduce((sum, spent) => sum + spent, 0);
    
    return monthlyBudget.amount - totalSpent;
  },

  // Получить прогресс по категории (0-100)
  getCategoryProgress: (categoryId) => {
    const { categoryLimits, spendingByCategory } = get();
    const limit = categoryLimits[categoryId] || 0;
    const spent = spendingByCategory[categoryId] || 0;
    
    return limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
  }
}));


// Обновленные вспомогательные функции
function calculateSpending(transactions, categoryLimits) {
  if (!transactions || !categoryLimits) return {};
  
  return transactions.reduce((acc, t) => {
    if (!t || t.type === 'income' || !t.category_id) return acc;
    
    const amount = Number(t.amount) || 0;
    const categoryId = Number(t.category_id) || t.category_id;
    
    return {
      ...acc,
      [categoryId]: (acc[categoryId] || 0) + amount
    };
  }, {});
}

function checkExceededLimits(spendingByCategory, categoryLimits) {
  if (!spendingByCategory || !categoryLimits) return [];
  
  return Object.entries(spendingByCategory)
    .filter(([categoryId, spent]) => {
      const limit = Number(categoryLimits[categoryId]) || 0;
      const spentAmount = Number(spent) || 0;
      return limit > 0 && spentAmount > limit;
    })
    .map(([categoryId]) => Number(categoryId) || categoryId);
}

// Подписки на изменения
useAuthStore.subscribe(
  state => state.isAuth,
  isAuth => {
    if (isAuth) {
      useBudgetStore.getState().fetchBudgetData();
    } else {
      useBudgetStore.setState({
        monthlyBudget: null,
        categoryLimits: {},
        spendingByCategory: {}
      });
    }
  }
);

useTransactionsStore.subscribe(
  state => state.transactions,
  () => {
    if (useAuthStore.getState().isAuth) {
      const { categoryLimits } = useBudgetStore.getState();
      const transactions = useTransactionsStore.getState().transactions;
      
      const spendingByCategory = calculateSpending(transactions, categoryLimits);
      const exceededLimits = checkExceededLimits(spendingByCategory, categoryLimits);
      
      useBudgetStore.setState({ spendingByCategory, exceededLimits });
    }
  }
);