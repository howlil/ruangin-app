import { UserRoute } from "@/components/ui/auth/ProtectRoute";
import Beranda from "@/pages/user/beranda";
import RiwayatUser from "@/pages/user/RiwayatPengguna";
import Peminjaman from "@/pages/user/Peminjaman";
import Jadwal from "@/pages/user/Jadwal";

export const UserRoutes = [
  {
    path: "/",
    element: <Beranda />,
  },
  {
    path: "/jadwal",
    element: <Jadwal />,
  },
  {
    path: "/u/riwayat",
    element: (
      <UserRoute>
        <RiwayatUser />
      </UserRoute>
    ),
  },
  {
    path: "/peminjaman/:id",
    element: (
      <Peminjaman />
    ),
  },
];