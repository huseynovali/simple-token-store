import { createBrowserRouter } from "react-router";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import MainLayout from "../components/layouts/MainLayout";
import Products from "../pages/Products";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        element: <Dashboard />,
        index: true,
      },
      {
        element: <Products />,
        path: "/products",
      },
    ],
  },
]);
