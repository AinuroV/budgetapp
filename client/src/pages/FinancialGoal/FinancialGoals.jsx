import React, { useEffect, useState } from 'react';
import ProgressBar from './ProgressBar';  // Подключите компонент

export const FinancialGoals = () => {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:4444/api/goals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        // Добавляем фейковую цель для тестирования
        const fakeGoal = {
          id: 1,
          title: "Купить новый автомобиль",
          targetAmount: 500000,
          currentAmount: 200000,
          deadline: "2025-12-31",
        };
        setGoals([fakeGoal, ...data]); // Добавляем фейковую цель перед реальными данными
      } else {
        throw new Error(data.message || 'Ошибка загрузки целей');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateGoal = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:4444/api/goals', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          targetAmount: parseFloat(targetAmount),
          deadline
        })
      });
      const newGoal = await response.json();
      if (response.ok) {
        setGoals(prev => [...prev, newGoal]);
        setTitle('');
        setTargetAmount('');
        setDeadline('');
      } else {
        throw new Error(newGoal.message || 'Ошибка добавления цели');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="goals-container">
      <h2>Финансовые цели</h2>

      <div className="goal-form">
        <input
          placeholder="Название цели"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Сумма"
          value={targetAmount}
          onChange={e => setTargetAmount(e.target.value)}
        />
        <input
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
        />
        <button onClick={handleCreateGoal}>Добавить цель</button>
      </div>

      <div className="goals-list">
        {goals.map(goal => {
          const progress = Math.min(
            (goal.currentAmount / goal.targetAmount) * 100,
            100
          ).toFixed(1);
          const remaining = (goal.targetAmount - goal.currentAmount).toFixed(2);

          return (
            <div key={goal.id} className="goal-card">
              <h3>{goal.title}</h3>
              <p>Цель: {goal.targetAmount} ₽</p>
              <p>Текущая сумма: {goal.currentAmount} ₽</p>
              <p>Осталось: {remaining} ₽</p>
              <p>Дедлайн: {new Date(goal.deadline).toLocaleDateString()}</p>
              <ProgressBar progress={progress} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
