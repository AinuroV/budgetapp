import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { initializeStores } from './store/index'
import { RequireSignIn } from "./components/RequireSignIn/RequireSignIn";
import { MainLayout } from "./components/MainLayout/MainLayout";
import { HomePage } from './pages/HomePage/HomePage';
import { LoginPage } from './pages/LoginPage/LoginPage'
import { RegisterPage } from './pages/RegisterPage/RegisterPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage/ResetPasswordPage'
import { DashboardPage } from './pages/DashboardPage/DashboardPage'
import { TransactionsPage } from './pages/TransactionsPage/TransactionsPage'
import { BudgetPage } from './pages/BudgetPage/BudgetPage'
import { SettingsPage } from './pages/SettingsPage/SettingsPage'
import { SupportPage } from './pages/SupportPage/SupportPage'
import { HelpPage } from './pages/HelpPage/HelpPage'
import { StatisticsPage } from './pages/StatisticsPage/StatisticsPage'
import { HistoryPage } from './pages/HistoryPage/HistoryPage'
import { CategoriesPage } from './pages/CategoriesPage/CategoriesPage'
import { Chart, registerables } from 'chart.js';



function App() {
  Chart.register(...registerables);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
          path: 'register',
          element: <RegisterPage />,
        },
        {
          path: 'reset-password',
          element: <ResetPasswordPage />,
        },
        {
          path: 'dashboard',
          element: <DashboardPage />,
        },
        {
          path: 'transactions',
          element: <TransactionsPage />,
        },
        {
          path: 'budget',
          element: <BudgetPage />,
        },
        {
          path: 'settings',
          element: <SettingsPage />,
        },
        {
          path: 'support',
          element: <SupportPage />,
        },
        {
          path: 'help',
          element: <HelpPage />,
        },
        {
          path: 'statistics',
          element: <StatisticsPage />
        },
        {
          path: 'history',
          element: <HistoryPage />
        },
        {
          path:'categories', 
          element:<CategoriesPage />
        }

      ],
    },
  ]);

  useEffect(() => {
    initializeStores()
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
