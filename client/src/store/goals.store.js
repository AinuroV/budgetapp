import { create } from 'zustand';
import { useAuthStore } from './auth.store';
import { useHistoryStore } from './history.store';

export const useGoalsStore = create((set, get) => ({
    // Состояние
    goals: [],
    activeGoals: [],
    completedGoals: [],
    isLoading: false,
    error: null,

    // Методы
    fetchGoals: async () => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:4444/api/goals', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка загрузки целей');
            }

            const goals = await response.json();

            // Разделяем цели на активные и завершенные
            const activeGoals = goals.filter(goal => !goal.completed);
            const completedGoals = goals.filter(goal => goal.completed);

            set({
                goals,
                activeGoals,
                completedGoals,
                isLoading: false,
            });
        } catch (error) {
            console.error('Fetch goals error:', error);
            set({
                error: error.message || 'Ошибка загрузки целей',
                isLoading: false,
            });
        }
    },

    addGoal: async (goalData) => {
        const { token } = useAuthStore.getState();
        if (!token) return false;

        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:4444/api/goals/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(goalData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка добавления цели');
            }

            const newGoal = await response.json();

            set(state => {
                const updatedGoals = [...state.goals, newGoal];
                return {
                    goals: updatedGoals,
                    activeGoals: updatedGoals.filter(g => !g.completed),
                    completedGoals: updatedGoals.filter(g => g.completed),
                    isLoading: false,
                };
            });

            // Добавляем запись в историю
            useHistoryStore.getState().addAction({
                action_type: 'ADD',
                entity_type:'Goal',
                entity_id: newGoal.id,
                new_data: newGoal
            });

            return true;
        } catch (error) {
            console.error('Add goal error:', error);
            set({
                error: error.message || 'Ошибка добавления цели',
                isLoading: false,
            });
            return false;
        }
    },

    updateGoal: async (id, updates) => {
        const { token } = useAuthStore.getState();
        if (!token) return false;

        set({ isLoading: true, error: null });
        try {
            const response = await fetch('http://localhost:4444/api/goals/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({id,...updates}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка обновления цели');
            }

            const updatedGoal = await response.json();
            const oldGoal = get().goals.find(g => g.id === id);

            set(state => {
                const updatedGoals = state.goals.map(g =>
                    g.id === id ? updatedGoal : g
                );

                return {
                    goals: updatedGoals,
                    activeGoals: updatedGoals.filter(g => !g.completed),
                    completedGoals: updatedGoals.filter(g => g.completed),
                    isLoading: false,
                };
            });

            // Добавляем запись в историю
            useHistoryStore.getState().addAction({
                action_type: 'UPDATE',
                entity_type:'Goal',
                entity_id: id,
                old_data: oldGoal,
                new_data: updatedGoal
            });

            return true;
        } catch (error) {
            console.error('Update goal error:', error);
            set({
                error: error.message || 'Ошибка обновления цели',
                isLoading: false,
            });
            return false;
        }
    },

    deleteGoal: async (id) => {
        const { token } = useAuthStore.getState();
        if (!token) return false;

        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`http://localhost:4444/api/goals/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({id}),
            });

            if (!response.ok) {
                throw new Error('Ошибка удаления цели');
            }

            const deletedGoal = get().goals.find(g => g.id === id);

            set(state => {
                const updatedGoals = state.goals.filter(g => g.id !== id);
                return {
                    goals: updatedGoals,
                    activeGoals: updatedGoals.filter(g => !g.completed),
                    completedGoals: updatedGoals.filter(g => g.completed),
                    isLoading: false,
                };
            });

            // Добавляем запись в истории
            useHistoryStore.getState().addAction({
                action_type: 'DELETE',
                entity_type:'Goal',
                entity_id: id,
                old_data: deletedGoal
            });

            return true;
        } catch (error) {
            console.error('Delete goal error:', error);
            set({
                error: error.message || 'Ошибка удаления цели',
                isLoading: false,
            });
            return false;
        }
    },

    // Добавить сумму к текущим накоплениям цели
    addToGoal: async (id, amount) => {
        const { token } = useAuthStore.getState();
        if (!token) return false;

        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`http://localhost:4444/api/goals/add-money`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({id, amount }),
            });

            if (!response.ok) {
                throw new Error('Ошибка пополнения цели');
            }

            const updatedGoal = await response.json();

            set(state => {
                const updatedGoals = state.goals.map(g =>
                    g.id === id ? updatedGoal : g
                );

                return {
                    goals: updatedGoals,
                    activeGoals: updatedGoals.filter(g => !g.completed),
                    completedGoals: updatedGoals.filter(g => g.completed),
                    isLoading: false,
                };
            });

            return true;
        } catch (error) {
            console.error('Add to goal error:', error);
            set({
                error: error.message || 'Ошибка пополнения цели',
                isLoading: false,
            });
            return false;
        }
    },

    // Получить цель по ID
    getGoalById: (id) => {
        return get().goals.find(goal => goal.id === id);
    },

    // Рассчитать прогресс цели (0-100)
    getGoalProgress: (id) => {
        const goal = get().goals.find(g => g.id === id);
        if (!goal) return 0;
        return Math.min(100, (Number(goal.current_amount) / Number(goal.target_amount)) * 100);
    }
}));

// Автоматическая загрузка целей при авторизации
useAuthStore.subscribe(
    (state) => state.isAuth,
    (isAuth) => {
        if (isAuth) {
            useGoalsStore.getState().fetchGoals();
        } else {
            useGoalsStore.setState({
                goals: [],
                activeGoals: [],
                completedGoals: []
            });
        }
    }
);