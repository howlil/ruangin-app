import LoginPage from "@/pages/LoginPage";
import { AdminRoutes } from "./AdminRoute";
import { UserRoutes } from "./UserRoute";
import NotFound from "@/pages/NotFound";

export const routes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path :"/*",
    element: <NotFound/>
  },
  ...AdminRoutes,
  ...UserRoutes,
];

