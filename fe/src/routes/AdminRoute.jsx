import { AdminRoute, SuperAdminRoute } from "@/components/ui/auth/ProtectRoute";
import Dashboard from "@/pages/admin/Dashboard";
import AjuanPeminjaman from "@/pages/admin/Peminjaman";
import Divisi from "@/pages/admin/Divisi";
import Riwayat from "@/pages/admin/Riwayat";
import Staff from "@/pages/admin/Staff";
import Ruangan from "@/pages/admin/Ruangan";

export const AdminRoutes = [
  // Admin & Super Admin Routes
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <Dashboard />
      </AdminRoute>
    ),
  },
  {
    path: "/ajuan-peminjaman",
    element: (
      <AdminRoute>
        <AjuanPeminjaman />
      </AdminRoute>
    ),
  },
  // Super Admin Only Routes
  {
    path: "/tim-kerja",
    element: (
      <SuperAdminRoute>
        <Divisi />
      </SuperAdminRoute>
    ),
  },
  {
    path: "/riwayat",
    element: (
      <SuperAdminRoute>
        <Riwayat />
      </SuperAdminRoute>
    ),
  },
  {
    path: "/staff",
    element: (
      <SuperAdminRoute>
        <Staff />
      </SuperAdminRoute>
    ),
  },
  {
    path: "/ruangan",
    element: (
      <SuperAdminRoute>
        <Ruangan />
      </SuperAdminRoute>
    ),
  },
];