import React, { useState } from "react";
import "./Category.css";

export const Category = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const categoriesType = [{ name: "Расходы" }, { name: "Доходы" }];

  return (
    <div className="regular-payments">
      <div className="category-types">
        {categoriesType.map((category, index) => (
          <button key={index} className="category-type">
            {category.name}
          </button>
        ))}
      </div>

      <button
        className="add-button"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "Скрыть форму" : "+ Добавить категорию"}
      </button>

      {showAddForm && (
        <div className="add-form">
          <input type="text" placeholder="Название категории" />
          <select>
            <option>Расходы</option>
            <option>Доходы</option>
          </select>
          <button className="save-button">Сохранить</button>
        </div>
      )}
    </div>
  );
};
