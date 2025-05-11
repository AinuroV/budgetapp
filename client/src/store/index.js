import { useTransactionsStore } from './transactions.store';
import { useCategoriesStore } from './categories.store';
import { useBudgetStore } from './budget.store';
import { useGoalsStore } from './goals.store';
import { useHistoryStore } from './history.store';
import { useUIStore } from './ui.store';
import { useAuthStore } from './auth.store';

/**
 * Экспортируем отдельные хранилища для случаев,
 * когда нужен доступ только к конкретному модулю
 */
export {
    useAuthStore,
    useTransactionsStore,
    useCategoriesStore,
    useBudgetStore,
    useGoalsStore,
    useHistoryStore,
    useUIStore
};

/**
 * Сбрасываем все хранилища при выходе из системы
 */
export const resetAllStores = () => {
    useAuthStore.getState().logout(); // logout уже триггерит сброс в других хранилищах
    useUIStore.getState().closeAllModals();
    useUIStore.getState().clearToasts();
};

/**
 * Хелпер для подписки на изменения авторизации
 */
export const onAuthChange = (callback) => {
    return useAuthStore.subscribe(
        (state) => state.isAuth,
        (isAuth) => callback(isAuth)
    );
};

/**
 * Хелпер для работы с API ошибками
 */
export const handleApiError = (error) => {
    const { addToast } = useUIStore.getState();

    console.error('API Error:', error);

    addToast({
        message: error.message || 'Произошла ошибка',
        type: 'error',
        persist: false
    });

    // Если ошибка авторизации - разлогиниваем
    if (error.status === 401) {
        resetAllStores();
    }
};