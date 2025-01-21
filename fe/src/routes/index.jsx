import LoginPage from "@/pages/LoginPage";
import { AdminRoutes } from "./AdminRoute";
import { UserRoutes } from "./UserRoute";
import NotFound from "@/pages/NotFound";
import Absensi from "../pages/user/Absensi";
import DisplayTimeline from "@/pages/DisplayTimeline";

export const routes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path :"/*",
    element: <NotFound/>
  },
  {
    path :"/absensi",
    element: <Absensi/>
  },
  {
    path :"/today",
    element: <DisplayTimeline/>
  },
  ...AdminRoutes,
  ...UserRoutes,
];

