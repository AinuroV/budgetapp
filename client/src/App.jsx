import { createBrowserRouter, RouterProvider } from "react-router";
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
import { useInitStore } from './store/useInitStore'


function App() {
  useInitStore()

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
          element: <RequireSignIn><DashboardPage /></RequireSignIn>,
        },
        {
          path: 'transactions',
          element: <RequireSignIn><TransactionsPage /></RequireSignIn>,
        },
        {
          path: 'budget',
          element: <RequireSignIn><BudgetPage /></RequireSignIn>,
        },
        {
          path: 'settings',
          element: <RequireSignIn><SettingsPage /></RequireSignIn>,
        },
        {
          path: 'support',
          element: <RequireSignIn><SupportPage /></RequireSignIn>,
        },
        {
          path: 'help',
          element: <RequireSignIn><HelpPage /></RequireSignIn>,
        },
        {
          path: 'statistics',
          element: <RequireSignIn><StatisticsPage /></RequireSignIn>
        },
        {
          path: 'history',
          element: <RequireSignIn><HistoryPage /></RequireSignIn>
        },
        {
          path: 'categories',
          element: <RequireSignIn><CategoriesPage /></RequireSignIn>
        }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
