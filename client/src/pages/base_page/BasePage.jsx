import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import PieChart from "./PieChart";
import "./BasePage.css";

export const BasePage = () => {
  const [categories, setCategories] = useState([
    { name: "Категория 1", percentage: 40, amount: "4000 ₽" },
    { name: "Категория 2", percentage: 60, amount: "6000 ₽" },
  ]);

  const total = categories.reduce(
    (sum, category) => sum + parseInt(category.amount),
    0
  );
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from?.pathname || "/";

  const getCategoryTransaction = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:4444/api/category", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при загрузке данных");
      }

      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error("Ошибка:", error);
      alert(error.message);
      return [];
    }
  };

  const addCategory = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const categoryName = prompt("Введите название категории:");
      if (!categoryName?.trim()) {
        alert("Название категории не может быть пустым");
        return;
      }

      const categoryLimit = prompt("Введите лимит для категории:");
      if (
        isNaN(categoryLimit) ||
        categoryLimit === null ||
        categoryLimit === ""
      ) {
        alert("Лимит должен быть числом");
        return;
      }

      const isIncome = confirm(
        "Это категория доходов? (OK - Да, Отмена - Нет)"
      );

      const response = await fetch("http://localhost:4444/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: categoryName.trim(),
          isTypeIncome: isIncome,
          limit: categoryLimit,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Ошибка при создании категории");
      }

      const createdCategory = resData.category;
      alert(resData.message || "Категория успешно создана");

      setCategories((prev) => [
        ...prev,
        {
          name: createdCategory.name,
          percentage: 0,
          amount: "0 ₽",
          id: createdCategory.id,
          isTypeIncome: createdCategory.isTypeIncome,
        },
      ]);
    } catch (error) {
      console.error("Ошибка:", error);
      alert(error.message);
    }
  };

  const handleCategoryClick = async (isTypeIncome) => {
    try {
      const response = await fetch(
        `http://localhost:4444/api/categories/type/${isTypeIncome}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
      } else {
        throw new Error(data.message || "Ошибка при загрузке категорий");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert(error.message);
    }
  };

  return (
    <div className="main-content">
      <div className="filters">
        <div className="type-filters">
          <button
            className="filter-button"
            onClick={() => handleCategoryClick(false)}
          >
            Расходы
          </button>
          <button
            className="filter-button"
            onClick={() => handleCategoryClick(true)}
          >
            Доходы
          </button>
          <button className="filter-button" onClick={() => navigate("/goals")}>
            Финансовые цели
          </button>
        </div>
        <div className="period-filters">
          <button className="period-button">День</button>
          <button className="period-button">Неделя</button>
          <button className="period-button">Месяц</button>
          <button className="period-button">Год</button>
        </div>
      </div>

      <div className="total-amount">
        <h2>Итоговая сумма: {total} ₽</h2>
        <PieChart data={{ categories, total }} centerText={true} />
      </div>

      <div className="categories-grid">
        {categories.map((category, index) => (
          <div key={index} className="category-card">
            <div className="category-info">
              <h3>{category.name}</h3>
              <span className="percentage">{category.percentage}%</span>
            </div>
            <div className="category-amount">{category.amount}</div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="add-category-button-container">
        <button className="add-category-button" onClick={addCategory}>
          Добавить категорию
        </button>
      </div>
    </div>
  );
};
