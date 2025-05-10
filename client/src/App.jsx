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

function App() {
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
        }
      ],
    },

    // {
    //   path:'/',
    //   element: <RequireSignIn><MainLayout /></RequireSignIn>,
    //   children: [
    //     {
    //       path: "/",
    //       element: <HomePage />,
    //     },
    //   ]
    // },
  ]);

  useEffect(() => {
    initializeStores()
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
