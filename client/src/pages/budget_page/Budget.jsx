import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from "react-router"
import './index.css'

export const BudgetPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const fromPage = location.state ? location.state.from.pathname : '/registration'
    const [sum, setSum] = useState('0')
    
    const budgetInSave = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                alert('Требуется авторизация');
                navigate('/login');
                return;
            }
        
            if (!sum || isNaN(sum)) {
                alert('Введите корректную сумму');
                return;
            }
        
            const result = await fetch('http://localhost:4444/api/budget', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    sum: Number(sum)
                })
            });
        
            if (!result.ok) {
                const errorData = await result.json();
                throw new Error(errorData.message || 'Ошибка сервера');
            }
        
            const res = await result.json();
            console.log('Ответ сервера:', res)

            alert(res.message || 'Бюджет успешно обновлен');
            navigate('/');
            // if (res.budgetCreate) {
            //     navigate('/user');
            // }
            
        } catch (error) {
            console.error('Ошибка при обновлении бюджета:', error);
            alert(error.message || 'Произошла ошибка при обновлении бюджета');
        }
    }

    // Добавим обработчик изменения input
    const handleInputChange = (e) => {
        setSum(e.target.value)
    }

    return (
        <div className="container">
            <div className="auth-animation">
                <img src="/based.png" alt="Log in image" className="animated-image" />
            </div>
        
            <div className="register-form-container">
                <h1 className="form-title">Бюджет</h1>
                <div className="form-fields">
                    <div className="form-field">
                        <input 
                            type="text" 
                            placeholder="Введите ваш бюджет" 
                            value={sum}
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div className="form_buttons">
                        <button className="button container" onClick={budgetInSave}>
                            Сохранить
                        </button>
                        <button 
                            className="button container register-button"
                            onClick={() => navigate(fromPage)} // Используем fromPage вместо '/registration'
                        >
                            Назад
                        </button> 
                    </div>
                </div>
            </div>
        </div>
    )
}