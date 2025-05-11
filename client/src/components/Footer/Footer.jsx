import styles from './Footer.module.css';
import { Link } from 'react-router';
export const Footer = () => {
  return (
      <footer className={styles.footer}>
        <div className="container">
          <div className="d-flex justify-content-center gap-3 py-2">
            <Link to="/support" className={styles.navLink}>Техническая поддержка</Link>
            <Link to="/help" className={styles.navLink}>Справка</Link>
          </div>
          <p>© 2025 Zi-BudgetApp. Все права защищены.</p>
        </div>
      </footer>
  )
}
