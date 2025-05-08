// ProgressBar.jsx
import React from 'react';

// Простой компонент для отображения прогресс-бара
const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;  // Экспортируем компонент как default
