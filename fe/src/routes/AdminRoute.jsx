import { AdminRoute, SuperAdminRoute } from "@/components/ui/auth/ProtectRoute";
import Dashboard from "@/pages/admin/Dashboard";
import AjuanPeminjaman from "@/pages/admin/Peminjaman";
import Riwayat from "@/pages/admin/Riwayat";
import Staff from "@/pages/admin/Staff";
import TimKerja from "@/pages/admin/TimKerja";
import Ruangan from "@/pages/admin/Ruangan";
import DetailPeminjaman from "@/pages/admin/Peminjaman/DetailPeminjaman";

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
  {
    path: "/ajuan-peminjaman/:id",
    element: (
      <AdminRoute>
        <DetailPeminjaman />
      </AdminRoute>
    ),
  },
  // Super Admin Only Routes
  {
    path: "/tim-kerja",
    element: (
      <SuperAdminRoute>
        <TimKerja/>
      </SuperAdminRoute>
    ),
  },
  {
    path: "/riwayat",
    element: (
      <AdminRoute>
        <Riwayat />
      </AdminRoute>
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