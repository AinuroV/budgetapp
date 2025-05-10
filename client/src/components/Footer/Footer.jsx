import styles from './Footer.module.css';

export const Footer = () => {
  return (
      <footer className={styles.footer}>
        <div className="container">
          <p>© 2024 BudgetApp. Все права защищены.</p>
        </div>
      </footer>
  )
}
