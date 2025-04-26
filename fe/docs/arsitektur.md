# Arsitektur Aplikasi RuangIn

## Pendahuluan

Dokumen ini menjelaskan arsitektur aplikasi RuangIn, sistem peminjaman ruangan yang dibangun dengan React, Vite, dan Tailwind CSS. Arsitektur aplikasi dirancang untuk mendukung pengembangan yang modular, pemeliharaan yang mudah, dan performa yang optimal.

## Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                       Presentation Layer                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │ Layouts │  │  Pages  │  │   UI    │  │ Page Components │ │
│  └─────────┘  └─────────┘  │Components│  └─────────────────┘ │
│                            └─────────┘                       │
├─────────────────────────────────────────────────────────────┤
│                        Application Layer                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │ Contexts │  │  Hooks  │  │ Routing │  │ State Management │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                        Infrastructure Layer                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │   API   │  │ Storage │  │ Utils   │  │    Services     │ │
│  │  Client │  │         │  │         │  │                 │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Layer Arsitektur

Aplikasi RuangIn menggunakan arsitektur berlapis yang terdiri dari:

### 1. Presentation Layer

Layer ini bertanggung jawab untuk tampilan visual dan interaksi pengguna.

**Komponen Utama:**
- **Layouts**: Struktur tata letak halaman (MainLayout, DashboardLayout)
- **Pages**: Komponen tingkat halaman (LoginPage, Dashboard, Peminjaman)
- **UI Components**: Komponen reusable (Button, Input, Modal)
- **Page Components**: Komponen khusus per halaman (BookingCard, RoomList)

**Teknologi:**
- React untuk membangun komponen UI
- Tailwind CSS untuk styling
- Headless UI untuk komponen yang dapat diakses
- Framer Motion untuk animasi

### 2. Application Layer

Layer ini mengelola logika aplikasi, state, dan alur data.

**Komponen Utama:**
- **Contexts**: React Context untuk manajemen state global (UserContext)
- **Hooks**: Custom hooks untuk logika yang dapat digunakan kembali (useBookingCalendar)
- **Routing**: Konfigurasi navigasi aplikasi
- **State Management**: Pengelolaan state lokal dan global

**Teknologi:**
- React Context API
- React Router v7
- Custom Hooks

### 3. Infrastructure Layer

Layer ini bertanggung jawab untuk komunikasi dengan sistem eksternal dan layanan infrastruktur.

**Komponen Utama:**
- **API Client**: Konfigurasi dan permintaan HTTP (axios)
- **Storage**: Manajemen penyimpanan lokal (cookies, localStorage)
- **Utils**: Fungsi utilitas untuk transformasi data, validasi, dll.
- **Services**: Layanan khusus aplikasi (autentikasi, pemberitahuan)

**Teknologi:**
- Axios untuk HTTP requests
- js-cookie untuk manajemen cookie
- CryptoJS untuk enkripsi data sensitif

## Aliran Data

Aliran data dalam aplikasi RuangIn mengikuti pola berikut:

1. **Input Pengguna**: Pengguna berinteraksi dengan komponen di Presentation Layer.
2. **Event Handling**: Event handler menangkap interaksi dan memanggil fungsi dari Application Layer.
3. **Proses Data**: Application Layer memproses data menggunakan state, context, dan hooks.
4. **Komunikasi API**: Jika diperlukan, Application Layer memanggil Infrastructure Layer untuk komunikasi dengan API.
5. **Update State**: Setelah memperoleh hasil, state diperbarui oleh Application Layer.
6. **Re-render**: Perubahan state memicu re-render komponen terkait di Presentation Layer.

## Strategi Manajemen State

RuangIn menggunakan beberapa strategi manajemen state:

### State Lokal

Untuk state yang hanya relevan di tingkat komponen, kami menggunakan React `useState` hook:

```jsx
const [selectedDate, setSelectedDate] = useState(null);
```

### State Global

Untuk state yang digunakan di seluruh aplikasi, kami menggunakan React Context API:

```jsx
// UserContext.jsx
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // ... logika lainnya

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
```

### Pemisahan Concerns

State dibagi berdasarkan domain:
- **User Context**: Mengelola autentikasi dan informasi pengguna
- **Booking State**: Mengelola state terkait peminjaman ruangan
- **UI State**: Mengelola state presentasi seperti mode tema, navigasi mobile, dll.

## Manajemen Routing

RuangIn menggunakan React Router v7 untuk manajemen routing. Strategi routing yang digunakan adalah:

### Struktur Routing

```jsx
// routes/index.jsx
export const routes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Beranda />,
  },
  // Admin routes dengan proteksi
  ...AdminRoutes,
  // User routes dengan proteksi
  ...UserRoutes,
];
```

### Route Terproteksi

Untuk rute yang memerlukan autentikasi, kami menggunakan komponen pembungkus:

```jsx
// ProtectedRoute.jsx
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
```

## Strategi Komunikasi API

RuangIn menggunakan Axios untuk komunikasi dengan backend API:

### Konfigurasi Axios

```jsx
// utils/api.js
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, 
});

// Token handling
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### Panggilan API Terstruktur

```jsx
const fetchRooms = async () => {
  try {
    setLoading(true);
    const response = await api.get('/v1/ruang-rapat');
    setRooms(response.data.data);
  } catch (error) {
    HandleResponse({ error });
  } finally {
    setLoading(false);
  }
};
```

## Struktur Folder

RuangIn menggunakan struktur folder yang modular dan terorganisir dengan baik:

```
src/
├── assets/         # Aset statis
├── components/     # Komponen UI reusable
│   ├── general/    # Komponen umum (Navbar, Footer)
│   ├── layout/     # Komponen layout
│   └── ui/         # Komponen UI dasar (Button, Input)
├── contexts/       # Context providers
├── hooks/          # Custom hooks
│   ├── apis/       # Hooks terkait API
│   └── ...
├── lib/            # Utility dan libraries
├── pages/          # Komponen halaman
│   ├── admin/      # Halaman admin
│   └── user/       # Halaman pengguna
├── routes/         # Konfigurasi routing
└── utils/          # Fungsi utilitas
```

## Kesimpulan

Arsitektur RuangIn dirancang untuk mendukung:

1. **Modularitas**: Komponen dan logika dapat digunakan kembali dan diganti dengan mudah
2. **Pemisahan Concerns**: Setiap layer memiliki tanggung jawab yang jelas
3. **Maintainability**: Kode terorganisir dengan baik memudahkan pemeliharaan dan pengembangan
4. **Skalabilitas**: Struktur yang modular memungkinkan penambahan fitur dengan mudah

Pendekatan ini memungkinkan pengembangan aplikasi yang lebih efisien dan kolaborasi tim yang lebih baik pada proyek RuangIn.