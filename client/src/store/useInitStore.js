import { useEffect } from 'react'
import { useAuthStore } from './auth.store'
import { useTransactionsStore } from './transactions.store';
import { useCategoriesStore } from './categories.store';
import { useBudgetStore } from './budget.store';
import { useGoalsStore } from './goals.store';
import { useHistoryStore } from './history.store';

export const useInitStore = () => {

    const { isAuth, checkAuth } = useAuthStore();

    const checkAuthfunc = async ()=> await checkAuth();

    useEffect(()=>{
        checkAuthfunc()
    },[])

    useEffect(()=>{
        // Если пользователь авторизован, загружаем данные
        if (isAuth) {
            useTransactionsStore.getState().fetchTransactions();
            useCategoriesStore.getState().fetchCategories();
            useBudgetStore.getState().fetchBudgetData();
            useGoalsStore.getState().fetchGoals();
            useHistoryStore.getState().fetchHistory();
        }
    },[isAuth])
}
