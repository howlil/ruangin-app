import LoginPage from "@/pages/LoginPage";
import { AdminRoutes } from "./AdminRoute";
import { UserRoutes } from "./UserRoute";

export const routes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  ...AdminRoutes,
  ...UserRoutes,
];

