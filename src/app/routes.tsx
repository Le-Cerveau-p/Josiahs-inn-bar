import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Inventory } from "./pages/Inventory";
import { Stocking } from "./pages/Stocking";
import { Outing } from "./pages/Outing";
import { Analytics } from "./pages/Analytics";
import { DrinkManagement } from "./pages/DrinkManagement";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { path: "dashboard", Component: Dashboard },
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "inventory", Component: Inventory },
      { path: "stocking", Component: Stocking },
      { path: "outing", Component: Outing },
      { path: "analytics", Component: Analytics },
      { path: "drinks", Component: DrinkManagement },
      { path: "settings", Component: Settings },
    ],
  },
]);
