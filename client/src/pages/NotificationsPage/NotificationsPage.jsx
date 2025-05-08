import React from 'react';
import './notifications.css';

const notifications = [
  {
    id: 1,
    title: 'Доход добавлен',
    message: 'Вы добавили доход: зарплата +70,000 ₽',
    date: '2025-05-08 10:30',
  },
  {
    id: 2,
    title: 'Напоминание о платеже',
    message: 'Завтра оплата по ипотеке - 25,000 ₽',
    date: '2025-05-07 09:00',
  },
  {
    id: 3,
    title: 'Цель достигнута',
    message: 'Вы накопили 100,000 ₽ на отпуск!',
    date: '2025-05-06 18:15',
  },
];

export function NotificationsPage() {
  return (
    <div className="notifications-container">
      <h1 className="notifications-title">Уведомления</h1>
      <div className="notifications-list">
        {notifications.map((notif) => (
          <div key={notif.id} className="notification-card">
            <div className="notification-header">
              <h2>{notif.title}</h2>
              <span className="notification-date">{notif.date}</span>
            </div>
            <p className="notification-message">{notif.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
