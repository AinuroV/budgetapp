import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './SettingsPage.css';

export const SettingsPage = () => {
  const [language, setLanguage] = useState('ru');
  const [timezone, setTimezone] = useState('GMT+3');
  const [currency, setCurrency] = useState('RUB');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleClearCache = () => {
    sessionStorage.clear();
    localStorage.clear();
    alert('Кэш очищен');
  };

  const handleEmailChange = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return alert('Введите корректный email');
    alert(`Email изменён на: ${email}`);
    setEmail('');
  };

  const handleUsernameChange = (e) => {
    e.preventDefault();
    if (username.trim().length < 3) return alert('Имя пользователя слишком короткое');
    alert(`Имя пользователя изменено на: ${username}`);
    setUsername('');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return alert('Пароль должен быть не менее 6 символов');
    if (!currentPassword) return alert('Введите текущий пароль');
    alert('Пароль успешно изменён');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="settings-container">
      <div className="setting-item">
        <label>Язык интерфейса</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="ru">Русский</option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      <div className="setting-item">
        <label>Часовой пояс</label>
        <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
          <option value="GMT+0">GMT+0</option>
          <option value="GMT+3">GMT+3 (Москва)</option>
          <option value="GMT+5">GMT+5</option>
          <option value="GMT+7">GMT+7</option>
        </select>
      </div>

      <div className="setting-item">
        <label>Валюта</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="RUB">₽ Рубли</option>
          <option value="USD">$ Доллары</option>
          <option value="EUR">€ Евро</option>
        </select>
      </div>

      <div className="setting-item">
        <button onClick={handleClearCache} className="clear-button">
          Очистить кэш
        </button>
      </div>

      <form onSubmit={handleEmailChange} className="setting-item">
        <label>Изменить Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Введите новый email"
        />
        <button type="submit">Сохранить</button>
      </form>

      <form onSubmit={handleUsernameChange} className="setting-item">
        <label>Изменить имя пользователя</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Новое имя пользователя"
        />
        <button type="submit">Сохранить</button>
      </form>

      <form onSubmit={handlePasswordChange} className="setting-item">
        <label>Смена пароля</label>
        <input 
          type="password" 
          value={currentPassword} 
          onChange={(e) => setCurrentPassword(e.target.value)} 
          placeholder="Текущий пароль"
        />
        <input 
          type="password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          placeholder="Новый пароль"
        />
        <button type="submit">Изменить пароль</button>
      </form>
    </div>
  );
};
