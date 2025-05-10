import { Link, useLocation } from 'react-router';
import styles from './Header.module.css';
import { useAuthStore } from '../../store';

export const Header = () => {
  const { isAuth, logout } = useAuthStore();
  const location = useLocation();
  const isPubRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');
  
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            <img src="/vite.svg" alt="BudgetApp" />
            <span>BudgetApp</span>
          </Link>

          <nav className={styles.nav}>
            {!isPubRoute && isAuth ? (
              <>
                <Link to="/dashboard" className={styles.navLink}>Дашборд</Link>
                <Link to="/transactions" className={styles.navLink}>Транзакции</Link>
                <Link to="/budget" className={styles.navLink}>Бюджет</Link>
                <Link to="/goals" className={styles.navLink}>Цели</Link>
                <button onClick={logout} className={styles.logoutBtn}>Выйти</button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.navLink}>Войти</Link>
                <Link to="/register" className={`btn ${styles.registerBtn}`}>Регистрация</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};