// src/store/categories.store.js
import { create } from 'zustand';
import { useAuthStore } from './auth.store';
import { useTransactionsStore } from './transactions.store';
import { useHistoryStore } from './history.store';

export const useCategoriesStore = create((set, get) => ({
    // Состояние
    categories: [],
    incomeCategories: [],
    expenseCategories: [],
    isLoading: false,
    error: null,

    // Методы
    fetchCategories: async () => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:3000/api/categories', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка загрузки категорий');
            }

            const categories = await response.json();

            // Разделяем категории на доходы/расходы
            const incomeCategories = categories.filter(c => c.isTypeIncome);
            const expenseCategories = categories.filter(c => !c.isTypeIncome);

            set({
                categories,
                incomeCategories,
                expenseCategories,
                isLoading: false,
            });
        } catch (error) {
            console.error('Fetch categories error:', error);
            set({
                error: error.message || 'Ошибка загрузки категорий',
                isLoading: false,
            });
        }
    },

    addCategory: async (categoryData) => {
        const { token } = useAuthStore.getState();
        if (!token) return false;

        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:3000/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(categoryData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка добавления категории');
            }

            const newCategory = await response.json();

            set(state => {
                const updatedCategories = [...state.categories, newCategory];
                return {
                    categories: updatedCategories,
                    [newCategory.isTypeIncome ? 'incomeCategories' : 'expenseCategories']:
                        [...state[newCategory.isTypeIncome ? 'incomeCategories' : 'expenseCategories'], newCategory],
                    isLoading: false,
                };
            });

            // Добавляем запись в историю
            useHistoryStore.getState().addAction({
                type: 'ADD_CATEGORY',
                entityId: newCategory.id,
                newData: newCategory
            });

            return true;
        } catch (error) {
            console.error('Add category error:', error);
            set({
                error: error.message || 'Ошибка добавления категории',
                isLoading: false,
            });
            return false;
        }
    },

    updateCategory: async (id, updates) => {
        const { token } = useAuthStore.getState();
        if (!token) return false;

        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`http://localhost:3000/api/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка обновления категории');
            }

            const updatedCategory = await response.json();
            const oldCategory = get().categories.find(c => c.id === id);

            set(state => {
                const updatedCategories = state.categories.map(c =>
                    c.id === id ? updatedCategory : c
                );

                // Обновляем разделенные списки
                const incomeCategories = updatedCategories.filter(c => c.isTypeIncome);
                const expenseCategories = updatedCategories.filter(c => !c.isTypeIncome);

                return {
                    categories: updatedCategories,
                    incomeCategories,
                    expenseCategories,
                    isLoading: false,
                };
            });

            // Обновляем связанные транзакции
            useTransactionsStore.getState().fetchTransactions();

            // Добавляем запись в историю
            useHistoryStore.getState().addAction({
                type: 'UPDATE_CATEGORY',
                entityId: id,
                oldData: oldCategory,
                newData: updatedCategory
            });

            return true;
        } catch (error) {
            console.error('Update category error:', error);
            set({
                error: error.message || 'Ошибка обновления категории',
                isLoading: false,
            });
            return false;
        }
    },

    deleteCategory: async (id) => {
        const { token } = useAuthStore.getState();
        if (!token) return false;

        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`http://localhost:3000/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка удаления категории');
            }

            const deletedCategory = get().categories.find(c => c.id === id);

            set(state => {
                const updatedCategories = state.categories.filter(c => c.id !== id);
                return {
                    categories: updatedCategories,
                    incomeCategories: updatedCategories.filter(c => c.isTypeIncome),
                    expenseCategories: updatedCategories.filter(c => !c.isTypeIncome),
                    isLoading: false,
                };
            });

            // Обновляем транзакции, которые ссылались на эту категорию
            useTransactionsStore.getState().fetchTransactions();

            // Добавляем запись в историю
            useHistoryStore.getState().addAction({
                type: 'DELETE_CATEGORY',
                entityId: id,
                oldData: deletedCategory
            });

            return true;
        } catch (error) {
            console.error('Delete category error:', error);
            set({
                error: error.message || 'Ошибка удаления категории',
                isLoading: false,
            });
            return false;
        }
    },

    // Получить категорию по ID
    getCategoryById: (id) => {
        return get().categories.find(category => category.id === id);
    },

    // Получить категории по типу (доход/расход)
    getCategoriesByType: (isIncome) => {
        return isIncome ? get().incomeCategories : get().expenseCategories;
    }
}));

// Автоматическая загрузка категорий при авторизации
useAuthStore.subscribe(
    (state) => state.isAuth,
    (isAuth) => {
        if (isAuth) {
            useCategoriesStore.getState().fetchCategories();
        } else {
            useCategoriesStore.setState({
                categories: [],
                incomeCategories: [],
                expenseCategories: []
            });
        }
    }
);