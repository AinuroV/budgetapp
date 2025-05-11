import { Link, useLocation,useNavigate } from 'react-router';
import styles from './Header.module.css';
import { useAuthStore } from '../../store';

export const Header = () => {
  const { isAuth, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const isPubRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');
  const onClickLogOut = async () => {
    const res = await logout()
    if (res) navigate('/')
  }
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            <img src="/icon-logo.png" width={50} height={50} alt="Zi-BudgetApp" />
            <span className='ps-2'>Zi-BudgetApp</span>
          </Link>

          <nav className={styles.nav}>
            {!isPubRoute && isAuth ? (
              <>
                <Link to="/dashboard" className={styles.navLink}>Дашборд</Link>
                <Link to="/transactions" className={styles.navLink}>Транзакции</Link>
                <Link to="/budget" className={styles.navLink}>Бюджет</Link>
                <Link to="/statistics" className={styles.navLink}>Cтатистика</Link>
                <Link to="/categories" className={styles.navLink}>Категории</Link>
                <Link to="/history" className={styles.navLink}>История</Link>
                <Link to="/settings" className={styles.navLink}>Настройки</Link>
                <button onClick={onClickLogOut} className={styles.logoutBtn}>Выйти</button>
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