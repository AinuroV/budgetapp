import React from 'react';
import './helpPage.css';

export function HelpPage() {
  return (
    <div className="help-container">
      <h1 className="help-title">Справка</h1>
      <div className="help-section">
        <h2>О приложении</h2>
        <p>
          Это приложение помогает отслеживать ваши доходы, расходы, ставить финансовые цели и планировать бюджет.
        </p>
      </div>

      <div className="help-section">
        <h2>Как добавить доход или расход?</h2>
        <p>
          Перейдите на главный экран и нажмите кнопку <strong>«Добавить»</strong>. Укажите сумму, категорию и дату.
        </p>
      </div>

      <div className="help-section">
        <h2>Как создать финансовую цель?</h2>
        <p>
          В разделе <strong>«Цели»</strong> нажмите <strong>«Новая цель»</strong>. Укажите сумму и срок достижения.
        </p>
      </div>

      <div className="help-section">
        <h2>Как настроить уведомления?</h2>
        <p>
          В настройках вы можете включить или отключить напоминания о платежах, уведомления о достижении целей и другие.
        </p>
      </div>

      <div className="help-section">
        <h2>Техническая поддержка</h2>
        <p>
          Если у вас возникли вопросы, напишите нам на email: <a href="mailto:support@budgetapp.ru">support@budgetapp.ru</a>
        </p>
      </div>
    </div>
  );
}
