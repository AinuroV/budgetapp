import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { initializeStores } from './store/index'
import { RequireSignIn } from "./components/RequireSignIn/RequireSignIn";
import { MainLayout } from "./components/MainLayout/MainLayout";
import { HomePage } from './pages/HomePage/HomePage';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children:[
        {
          index:true,
          element:<HomePage />,
        }
      ]
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
