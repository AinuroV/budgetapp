import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './TransactionPage.css';

export const TransactionsPage = () => {
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [isTypeIncome, setIsTypeIncome] = useState(true);  // Добавьте поле для типа транзакции

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:4444/api/category', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        } else {
          throw new Error('Не удалось загрузить категории');
        }
      } catch (error) {
        console.error('Ошибка:', error);
        alert(error.message);
      }
    };

    fetchCategories();
  }, [navigate]);

  const handleAddTransaction = async () => {
    if (!amount || !category || !date) {
      alert('Все поля обязательны для заполнения');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:4444/api/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: 'Транзакция',  // Имя транзакции    
          sum: parseInt(amount),  // Сумма транзакции
          categoryId: category,  // ID категории
          date_transaction: date,  // Дата транзакции
          isTypeIncome: isTypeIncome,  // Тип транзакции (доход/расход)
        }),
      });



      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при добавлении транзакции');
      }

      
      alert('Транзакция успешно добавлена');
      navigate('/'); 
    } 
    catch (error) {
      console.error('Ошибка:', error);
      alert(error.message);
    }
  };

  return (
    <div className="transactions-page">
      <main>
        <h2>Добавить транзакцию</h2>
        
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <label>Сумма</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Введите сумму"
            />
          </div>
          
          <div className="input-group">
            <label>Категория</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Выберите категорию</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Дата</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Тип транзакции</label>
            <select value={isTypeIncome} onChange={(e) => setIsTypeIncome(e.target.value === 'true')}>
              <option value={true}>Доход</option>
              <option value={false}>Расход</option>
            </select>
          </div>

          <button type="button" onClick={handleAddTransaction}>Добавить</button>
        </form>
      </main>
    </div>
  );
};
