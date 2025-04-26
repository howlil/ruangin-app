# Routing dan Navigasi di RuangIn

## Pendahuluan

Routing dan navigasi adalah aspek penting dalam aplikasi single-page (SPA) seperti RuangIn. Dokumen ini menjelaskan implementasi, struktur, dan strategi routing yang digunakan dalam aplikasi untuk memastikan navigasi yang mulus dan aman.

## Teknologi

RuangIn menggunakan **React Router v7** sebagai library routing utama dengan fitur-fitur berikut:

- **Declarative Routing**: Mendefinisikan routes sebagai komponen React
- **Nested Routes**: Mendukung hierarki route bersarang
- **Route Protection**: Kontrol akses route berdasarkan autentikasi dan otorisasi
- **Dynamic Routing**: Route dengan parameter dinamis
- **Navigation State**: State persisten antar navigasi

## Struktur Routing

Struktur routing RuangIn dibagi menjadi beberapa kelompok utama untuk mempermudah pengelolaan dan pemisahan concern:

### 1. Root Routes

Rute utama aplikasi yang menangani entrypoint dan halaman umum:

```jsx
// routes/index.jsx
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
    path: "/*",
    element: <NotFound/>
  },
  {
    path: "/absensi",
    element: <Absensi/>
  },
  {
    path: "/today",
    element: <DisplayTimeline/>
  },
  ...AdminRoutes,
  ...UserRoutes,
];
```

### 2. Admin Routes

Rute khusus untuk panel admin dengan proteksi akses:

```jsx
// routes/AdminRoute.jsx
import { AdminRoute, SuperAdminRoute } from "@/components/ui/auth/ProtectRoute";
import Dashboard from "@/pages/admin/Dashboard";
import AjuanPeminjaman from "@/pages/admin/Peminjaman";
import Riwayat from "@/pages/admin/Riwayat";
import Staff from "@/pages/admin/Staff";
import TimKerja from "@/pages/admin/TimKerja";
import Ruangan from "@/pages/admin/Ruangan";
import DetailPeminjaman from "@/pages/admin/Peminjaman/DetailPeminjaman";

export const AdminRoutes = [
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
```

### 3. User Routes

Rute untuk pengguna biasa dengan proteksi akses spesifik:

```jsx
// routes/UserRoute.jsx
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
```

## Proteksi Route

RuangIn mengimplementasikan proteksi route untuk memastikan pengguna hanya dapat mengakses halaman yang sesuai dengan peran (role) mereka.

### Route Guard Components

Komponen pembungkus untuk proteksi route:

```jsx
// components/ui/auth/ProtectRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { getUser, hasPermission, ROLES } from '@/utils/auth';

export const ProtectedRoute = ({ children, allowedRoles, redirectPath = '/login' }) => {
  const location = useLocation();
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPermission(allowedRoles)) {
    if (user.role === ROLES.PEMINJAM) {
      return <Navigate to="/" replace />;
    }
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export const UserRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={[ROLES.PEMINJAM, ROLES.ADMIN]} redirectPath="/">
      {children}
    </ProtectedRoute>
  );
};

export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute 
      allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]} 
      redirectPath="/dashboard"
    >
      {children}
    </ProtectedRoute>
  );
};

export const SuperAdminRoute = ({ children }) => {
  return (
    <ProtectedRoute 
      allowedRoles={[ROLES.SUPERADMIN]} 
      redirectPath="/dashboard"
    >
      {children}
    </ProtectedRoute>
  );
};
```

### Authorization Logic

Logika otorisasi untuk memeriksa peran pengguna:

```jsx
// utils/auth.js
export const ROLES = {
    SUPERADMIN: 'SUPERADMIN',
    ADMIN: 'ADMIN',
    PEMINJAM: 'PEMINJAM'
};

export const getUser = () => {
    try {
        const userData = getUserDataFromCookie()
        if (!userData) return null;
        return userData.user;
    } catch (error) {
        return null;
    }
};

export const getUserRole = () => {
    const user = getUser();
    return user?.role || null;
};

export const hasPermission = (requiredRoles) => {
    const userRole = getUserRole();
    if (!userRole) return false;
    return requiredRoles.includes(userRole);
};

// Define route permissions
export const ROUTE_PERMISSIONS = {
    // Admin Routes
    '/dashboard': [ROLES.SUPERADMIN, ROLES.ADMIN],
    '/ajuan-peminjaman': [ROLES.SUPERADMIN, ROLES.ADMIN],
    '/divisi': [ROLES.SUPERADMIN],
    '/riwayat': [ROLES.SUPERADMIN],
    '/staff': [ROLES.SUPERADMIN],
    '/ruangan': [ROLES.SUPERADMIN],

    // User Routes
    '/u/riwayat': [ROLES.PEMINJAM],
};
```

## Sistem Navigasi

### Navigasi Programatis

RuangIn menggunakan hooks dari React Router untuk navigasi programatis:

```jsx
import { useNavigate } from 'react-router-dom';

function BookNowButton({ roomId }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/peminjaman/${roomId}`);
  };
  
  return (
    <Button onClick={handleClick}>
      Lihat Detail
    </Button>
  );
}
```

### Navigasi dengan Parameter Query

Navigasi dengan parameter query untuk filter dan pagination:

```jsx
import { useSearchParams } from 'react-router-dom';

function FilterComponent() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const handleFilterChange = (status) => {
    setSearchParams({ 
      status, 
      page: '1',
      size: '10' 
    });
  };
  
  return (
    <button onClick={() => handleFilterChange('DISETUJUI')}>
      Filter Disetujui
    </button>
  );
}
```

### Redirect dengan State

Navigasi dengan menyimpan state (misalnya untuk redirect after login):

```jsx
// Menyimpan lokasi asal
<Navigate to="/login" state={{ from: location }} replace />

// Mengakses state setelah login
const location = useLocation();
const navigate = useNavigate();

const onLoginSuccess = () => {
  const destination = location.state?.from?.pathname || '/dashboard';
  navigate(destination, { replace: true });
};
```

## Layouts dan Route Organization

RuangIn menggunakan pendekatan berbasis layout untuk konsistensi antarmuka pengguna:

### Layout Wrappers

```jsx
// components/layout/DashboardLayout.jsx
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

// components/layout/MainLayout.jsx
export default function MainLayout({children}) {
  return (
    <>
      <Navbar/>
      <main>
        {children}
      </main>
      <KKPFooter/>
    </>
  );
}
```

### Penerapan Layout dalam Routing

Layout digunakan langsung dalam komponen halaman:

```jsx
// pages/admin/Dashboard/index.jsx
export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Dashboard content */}
      </div>
    </DashboardLayout>
  );
}

// pages/user/Jadwal/index.jsx
export default function RoomBookingCalendar() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-20 md:py-20">
        {/* Calendar content */}
      </div>
    </MainLayout>
  );
}
```

## Pengelolaan Navigasi Mobile

Untuk pengalaman mobile yang optimal, RuangIn memanfaatkan state navigasi khusus:

```jsx
// components/general/Navbar/index.jsx
const [isOpen, setIsOpen] = useState(false);

// Menutup mobile menu saat route berubah
useEffect(() => {
  setIsOpen(false);
}, [location.pathname]);

// Toggle menu
const toggleMenu = () => {
  setIsOpen(!isOpen);
};

return (
  <>
    <nav className="fixed w-full z-50 top-0">
      <MobileMenuButton isOpen={isOpen} onClick={toggleMenu} />
      {/* ... */}
    </nav>
    <MobileNav isOpen={isOpen} navItems={navItems} />
  </>
);
```

## Navigasi Sidebar Admin

Navigasi sidebar untuk panel admin dibuat berdasarkan peran pengguna:

```jsx
// components/general/dashboard/Sidebar.jsx
import { MENU_ITEMS } from './constants';

export function Sidebar({ activeItem, setActiveItem, isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  // Filter menu items berdasarkan izin pengguna
  const filteredMenuItems = MENU_ITEMS.filter(item => 
    hasPermission(item.allowedRoles)
  );

  return (
    <aside className="...">
      <nav className="p-4">
        {filteredMenuItems.map((item) => (
          <SidebarItem
            key={item.text}
            icon={item.icon}
            text={item.text}
            active={activeItem === item.text}
            onClick={() => handleMenuClick(item.text, item.path)}
          />
        ))}
      </nav>
    </aside>
  );
}
```

```jsx
// components/general/dashboard/constants.js
import { ROLES } from '@/utils/auth';

export const MENU_ITEMS = [
    {
        icon: LayoutDashboard,
        text: 'Dashboard',
        path: '/dashboard',
        allowedRoles: [ROLES.ADMIN, ROLES.SUPERADMIN]
    },
    {
        icon: FileText,
        text: 'Ajuan Peminjaman',
        path: '/ajuan-peminjaman',
        allowedRoles: [ROLES.ADMIN, ROLES.SUPERADMIN]
    },
    // Item menu lainnya...
];
```

## Error Handling dalam Routing

RuangIn menangani error routing dengan beberapa strategi:

### 1. Not Found Page (404)

```jsx
// routes/index.jsx
{
  path: "/*",
  element: <NotFound/>
}

// pages/NotFound.jsx
export default function NotFound() {
  const router = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-6">
      <div className="text-center">
        {/* 404 content */}
        <button
          onClick={() => router('/')}
          className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors group"
        >
          <Home className="mr-2 group-hover:animate-pulse" size={20} />
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
```

### 2. Redirect dari Halaman Terproteksi

```jsx
<Navigate to="/login" state={{ from: location }} replace />
```

### 3. Pengelolaan Data Tidak Ditemukan

```jsx
// Contoh ketika data spesifik tidak ditemukan
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await api.get(`/v1/peminjaman/${id}`);
      // ...
    } catch (error) {
      navigate('/ajuan-peminjaman'); // Redirect ke halaman list
      HandleResponse({
        error,
        errorMessage: 'error'
      });
    }
  };
  
  fetchData();
}, [id]);
```

## Lazy Loading (Code Splitting)

Meskipun tidak diimplementasikan sepenuhnya dalam codebase saat ini, RuangIn memiliki struktur yang mendukung lazy loading untuk rute sebagai future improvement:

```jsx
// Contoh implementasi potensial
import { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const RuanganPage = lazy(() => import('@/pages/admin/Ruangan'));

const lazyRoutes = [
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard />
        </Suspense>
      </AdminRoute>
    ),
  },
  // ...more routes
];
```

## Praktik Terbaik dan Panduan

### 1. Konsistensi Struktur URL

- Gunakan kebab-case untuk URL path (contoh: `/ajuan-peminjaman`)
- Gunakan parameter query untuk filter dan pagination (contoh: `/riwayat?status=DISETUJUI&page=1`)
- Gunakan parameter path untuk identifier (contoh: `/peminjaman/:id`)

### 2. Nested Routes

- Gunakan nested routes untuk fitur yang berhubungan
- Terapkan layout konsisten untuk grup route

### 3. Type-Safety

- Gunakan konstanta untuk nama route
- Gunakan helper function untuk navigasi yang kompleks

### 4. Pemisahan Concern

- Pisahkan logika route berdasarkan domain (admin, user)
- Enkapsulasi logika otorisasi route

## Ringkasan

Sistem routing dan navigasi di RuangIn dirancang dengan fokus pada:

1. **Keamanan**: Dengan route guard untuk otorisasi dan autentikasi
2. **Pengalaman Pengguna**: Navigasi yang mulus dan intuitif
3. **Maintainability**: Struktur modular yang mudah dipelihara
4. **Performa**: Optimasi untuk pengalaman pengguna yang cepat

Pendekatan ini memberikan dasar yang solid untuk navigasi aplikasi yang kompleks dengan berbagai tipe pengguna dan hak akses.