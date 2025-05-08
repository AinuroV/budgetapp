// src/pages/support_page/SupportPage.jsx
import React from 'react';
import { useNavigate } from 'react-router';
import './SupportPage.css'; // Создай если хочешь кастомные стили

export const SupportPage = () => {
  const navigate = useNavigate();

  return (

      <div className="main-content">
        <p style={{ marginBottom: 20 }}>
          Если у вас возникли вопросы или проблемы, свяжитесь с нашей поддержкой:
        </p>

        <form className="support-form">
          <label>
            Тема:
            <input type="text" placeholder="Введите тему обращения" required />
          </label>

          <label>
            Сообщение:
            <textarea placeholder="Опишите вашу проблему" rows={5} required />
          </label>

          <button type="submit" className="add-category-button">
            Отправить сообщение
          </button>
        </form>
      </div>

  );
};
