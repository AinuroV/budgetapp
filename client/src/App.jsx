import { LoginPage } from "./pages/login_page/LoginPage";
import { Layout } from "./components/Layout/Layout"
import { BasePage } from "./pages/base_page/BasePage";
import { Category } from "./pages/category_page/Category";
import { BudgetPage } from "./pages/budget_page/Budget";
import { RegistrationPage } from "./pages/registration_page/RegistrationPage";
import { createBrowserRouter, RouterProvider } from "react-router";
import { SettingsPage } from "./pages/settings_page/Setting_Page";
import { SupportPage } from "./pages/support_page/SupportPage";
import { TransactionsPage } from "./pages/transactions_page/TransactionsPage";
import { FinancialGoals } from "./pages/FinancialGoal/FinancialGoals";
import {NotificationsPage} from "./pages/NotificationsPage/NotificationsPage"
import { HelpPage } from "./pages/HelpPage/HelpPage";
function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/registration",
      element: <RegistrationPage />,
    },
    {
      element: <Layout/>,
      children: [
        {
          path: "/",
          element: <BasePage />,
        },
        {
          path: "/budget",
          element: <BudgetPage />,
        },
        {
          path: "/category",
          element: <Category />,
        },
        {
          path: "/setting",
          element: <SettingsPage />,
        },
        {
          path: "/support",
          element: <SupportPage />,
        },
        {
          path: "/transactions",
          element: <BasePage />, // Новый маршрут для транзакций
        },
        {
          path: "/goals",
          element: <FinancialGoals />,
        },
        {
          path: "/notifications",
          element: <NotificationsPage />
        },
        {
          path: "/help",
          element: <HelpPage />
        },
      ]
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
