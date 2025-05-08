import React from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router";
import "./layout.css";

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:4444/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Ошибка при выходе из системы");

      sessionStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      sessionStorage.removeItem("token");
      navigate("/login");
    }
  };
  console.log(path)
  return (
    <div className="app-container">
      <header className="header">
        <div className="container header-nav-buttons">
          <Link to={"/notifications"} className={`nav-button ${path==='/notifications' && 'active'}`}>
            Уведомления
          </Link>
          <Link to={"/category"} className={`nav-button ${path==='/category' && 'active'}`}>
            Категории
          </Link>
          <Link to={"/transactions"} className={`nav-button ${path==='/transactions' && 'active'}`}>
            Транзакции
          </Link>
          <Link to={"/setting"} className={`nav-button ${path==='/setting' && 'active'}`}>
            Настройки
          </Link>
          <Link to={"/support"} className={`nav-button ${path==='/support' && 'active'}`}>
            Техническая поддержка
          </Link>
          <Link to={"/help"} className={`nav-button ${path==='/help' && 'active'}`}>
            Справка
          </Link>

          <button
            className="nav-button"
            onClick={handleLogout}
          >
            Выход
          </button>
        </div>
      </header>
      <main className="container">
        {path!=='/' && <Link className="back-button" to="/">⬅ Назад</Link>}
        <Outlet />
      </main>
    </div>
  );
};
