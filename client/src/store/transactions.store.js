import { create } from 'zustand';
import { useAuthStore } from './auth.store';
import { useHistoryStore } from './history.store';

export const useTransactionsStore = create((set, get) => ({
    // Состояние
    transactions: [],
    filteredTransactions: [],
    isLoading: false,
    error: null,

    // Фильтры и пагинация
    filters: {
        dateRange: 'all', // week/month/year/custom
        startDate: null,
        endDate: null,
        category: null,
        type: null, // income/expense
        searchQuery: '',
    },
    pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
    },

    // Методы
    fetchTransactions: async () => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        set({ isLoading: true, error: null });
        try {
            const { filters } = get();
            const queryParams = new URLSearchParams({
                dateRange: filters.dateRange,
                ...(filters.startDate && { startDate: filters.startDate.toISOString() }),
                ...(filters.endDate && { endDate: filters.endDate.toISOString() }),
                ...(filters.category && { category: filters.category }),
                ...(filters.type && { type: filters.type }),
                ...(filters.searchQuery && { search: filters.searchQuery }),
                page: get().pagination.currentPage,
                limit: get().pagination.itemsPerPage,
            });

            const response = await fetch(`http://localhost:4444/api/transactions?${queryParams}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка загрузки транзакций');
            }

            const { transactions, total } = await response.json();

            set({
                transactions,
                filteredTransactions: transactions,
                pagination: { ...get().pagination, totalItems: total },
                isLoading: false,
            });
        } catch (error) {
            console.error('Fetch transactions error:', error);
            set({
                error: error.message || 'Ошибка загрузки транзакций',
                isLoading: false,
            });
        }
    },

    addTransaction: async (transactionData) => {
        const { token } = useAuthStore.getState();
        if (!token) return false;

        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:4444/api/transactions/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(transactionData),
            });

            if (!response.ok) {
                throw new Error('Ошибка добавления транзакции');
            }

            const newTransaction = await response.json();

            set(state => ({
                transactions: [newTransaction, ...state.transactions],
                isLoading: false,
            }));

            // Обновляем фильтрованный список
            get().applyFilters();
            return true;
        } catch (error) {
            console.error('Add transaction error:', error);
            set({
                error: error.message || 'Ошибка добавления транзакции',
                isLoading: false,
            });
            return false;
        }
    },

    updateTransaction: async (id, updates) => {
        const { token } = useAuthStore.getState();
        if (!token) return false;

        set({ isLoading: true, error: null });

        try {
            // 1. Получаем текущее состояние
            const currentState = get();
            const oldTransaction = currentState.transactions.find(t => t.id === id);

            // 2. Отправляем запрос
            const response = await fetch('http://localhost:4444/api/transactions/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({id,...updates}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка обновления транзакции');
            }

            const updatedTransaction = await response.json();

            // 3. Обновляем состояние
            set(state => ({
                transactions: state.transactions.map(t =>
                    t.id === id ? { ...t, ...updatedTransaction } : t
                ),
                isLoading: false,
            }));

            // 4. Обновляем фильтры
            currentState.applyFilters();

            // 5. Логируем действие
            useHistoryStore.getState().addAction({
                type: 'UPDATE_TRANSACTION',
                entityId: id,
                oldData: oldTransaction,
                newData: updatedTransaction
            });

            return true;
        } catch (error) {
            set({
                error: error.message || 'Ошибка обновления транзакции',
                isLoading: false,
            });
            return false;
        }
    },

    deleteTransaction: async (id) => {
        const { token } = useAuthStore.getState();
        if (!token) return false;

        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:4444/api/transactions/delete', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({id}),
            });

            if (!response.ok) {
                throw new Error('Ошибка удаления транзакции');
            }

            set(state => ({
                transactions: state.transactions.filter(t => t.id !== id),
                isLoading: false,
            }));

            // Обновляем фильтрованный список
            get().applyFilters();
            return true;
        } catch (error) {
            console.error('Delete transaction error:', error);
            set({
                error: error.message || 'Ошибка удаления транзакции',
                isLoading: false,
            });
            return false;
        }
    },

    // Фильтрация и сортировка
    setFilter: (filterName, value) => {
        set(state => ({
            filters: { ...state.filters, [filterName]: value },
            pagination: { ...state.pagination, currentPage: 1 },
        }));
        get().applyFilters();
    },

    applyFilters: () => {
        const { transactions, filters } = get();

        let filtered = [...transactions];

        // Фильтрация по дате
        if (filters.dateRange === 'custom' && filters.startDate && filters.endDate) {
            filtered = filtered.filter(t => {
                const date = new Date(t.date);
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

            filtered = filtered.filter(t => new Date(t.date) >= startDate);
        }

        // Фильтрация по категории
        if (filters.category) {
            filtered = filtered.filter(t => t.categoryId === filters.category);
        }

        // Фильтрация по типу
        if (filters.type) {
            filtered = filtered.filter(t => t.isTypeIncome === (filters.type === 'income'));
        }

        // Поиск по описанию
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.name.toLowerCase().includes(query) ||
                (t.description && t.description.toLowerCase().includes(query))
            );
        }

        // Пагинация
        const { currentPage, itemsPerPage } = get().pagination;
        const paginated = filtered.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

        set({
            filteredTransactions: paginated,
            pagination: { ...get().pagination, totalItems: filtered.length },
        });
    },

    // Пагинация
    setPage: (page) => {
        set(state => ({
            pagination: { ...state.pagination, currentPage: page },
        }));
        get().applyFilters();
    },
}));

// Инициализация при загрузке
useAuthStore.subscribe(
    (state) => state.isAuth,
    (isAuth) => {
        if (isAuth) {
            useTransactionsStore.getState().fetchTransactions();
        } else {
            useTransactionsStore.setState({ transactions: [], filteredTransactions: [] });
        }
    }
);