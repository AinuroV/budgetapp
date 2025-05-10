import { Outlet } from "react-router";
import { Header } from '../Header/Header'
import { Footer } from '../Footer/Footer'
import styles from './MainLayout.module.css';

export const MainLayout = () => {
    return (
        <div className={styles.layout}>
            <Header />
            <main className={styles.main}>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
