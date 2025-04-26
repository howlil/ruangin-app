# State Management di RuangIn

## Pendahuluan

State management adalah aspek krusial dalam arsitektur aplikasi React, terutama untuk aplikasi kompleks seperti RuangIn. Dokumen ini menjelaskan strategi dan implementasi pengelolaan state dalam aplikasi RuangIn.

## Strategi State Management

RuangIn menggunakan pendekatan multi-level dalam state management untuk memastikan keseimbangan antara performa, pemeliharaan kode, dan kompleksitas:

1. **Component-level State**: Menggunakan React hooks (`useState`, `useReducer`) untuk state lokal
2. **Application-level State**: Menggunakan React Context API untuk state global
3. **URL sebagai State**: Menggunakan URL dan parameter query untuk state persisten dan shareable

Pendekatan ini memungkinkan tim untuk menyimpan state di level yang sesuai dengan jangkauan penggunaannya, mengoptimalkan performa dan maintainability.

## Component-level State Management

Component-level state digunakan untuk state yang hanya relevan untuk komponen tertentu atau subset kecil dari komponen.

### Contoh: useState Hook

```jsx
// pages/user/Peminjaman/BookingRoomDialog.jsx
const [formData, setFormData] = useState({
  nama_kegiatan: '',
  tanggal_mulai: '',
  tanggal_selesai: '',
  jam_mulai: '',
  jam_selesai: '',
  no_surat_peminjaman: ''
});

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
```

### Contoh: useReducer Hook

Untuk state yang lebih kompleks dengan multiple subfields dan logika update yang terkait, kami menggunakan `useReducer`:

```jsx
// Contoh implementasi potensial
const initialState = {
  isValid: false,
  errors: {},
  fields: {
    nama_kegiatan: '',
    tanggal_mulai: '',
    // ... field lainnya
  }
};

function formReducer(state, action) {
  switch (action.type) {
    case 'FIELD_CHANGE':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: action.value
        }
      };
    case 'VALIDATE':
      const errors = validateForm(state.fields);
      return {
        ...state,
        isValid: Object.keys(errors).length === 0,
        errors
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Dalam komponen
const [state, dispatch] = useReducer(formReducer, initialState);
```

## Application-level State Management

Application-level state digunakan untuk state yang perlu diakses oleh banyak komponen di seluruh aplikasi, seperti data user, autentikasi, dan preferensi aplikasi.

### UserContext

Context untuk informasi pengguna, autentikasi, dan manajemen sesi:

```jsx
// contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getUserDataFromCookie, clearAuthCookies, storeUserDataInCookie } from '@/utils/cookie';
import { useNavigate, useLocation } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = () => {
    try {
      const userData = getUserDataFromCookie();
      if (userData) {
        setUser(userData.user);
        localStorage.setItem("token", userData.token);
      } else {
        handleLogout(false); 
      }
    } catch (error) {
      handleLogout(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (shouldRedirect = true) => {
    clearAuthCookies();
    localStorage.removeItem("token");
    setUser(null);
    
    if (shouldRedirect && !location.pathname.includes('/login')) {
      navigate('/login');
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    storeUserDataInCookie(userData, localStorage.getItem("token"));
  };

  const value = {
    user,
    loading,
    logout: handleLogout,
    updateUser,
    initializeUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
```

### Menggunakan Context

```jsx
// Di komponen yang perlu mengakses state user
import { useUser } from '@/contexts/UserContext';

function UserProfile() {
  const { user, logout } = useUser();
  
  return (
    <div>
      <h2>Profil {user.nama_lengkap}</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## URL sebagai State

RuangIn memanfaatkan URL dan parameter query sebagai bagian dari strategi state management, terutama untuk:

1. State yang perlu di-share (shareable state)
2. Navigasi dan filter
3. Pagination

### Contoh: URL-based Filtering

```jsx
// pages/user/RiwayatPengguna/index.jsx
import { useSearchParams } from 'react-router-dom';

export default function RiwayatUser() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Dapatkan nilai dari URL params
  const currentStatus = searchParams.get('status') || 'DIPROSES';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('size') || '10', 10);

  // Update URL saat filter berubah
  const handleStatusChange = (status) => {
    setSearchParams({ 
      status, 
      page: '1',
      size: pageSize.toString() 
    });
  };
  
  // Implementasi pagination
  const handlePageChange = (newPage) => {
    setSearchParams({ 
      status: currentStatus, 
      page: newPage.toString(),
      size: pageSize.toString() 
    });
  };

  // ... logika untuk fetch data berdasarkan parameter
}
```

## Custom Hooks untuk State Management

Untuk menyederhanakan logika state dan meningkatkan reusabilitas, RuangIn mengimplementasikan beberapa custom hooks:

### useBookingCalendar

Custom hook untuk mengelola state kalender peminjaman:

```jsx
// hooks/apis/useBookingCalendar.js
import { useState, useEffect } from 'react';
import { eachDayOfInterval, parseISO, format } from 'date-fns';
import { HandleResponse } from '@/components/ui/HandleResponse';

export const useBookingCalendar = (api) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [expandedCells, setExpandedCells] = useState({});

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const response = await api.get('/v1/ruang-rapat', {
                    params: {
                        month: format(currentDate, 'yyyy-MM')
                    }
                });
                setRooms(response.data.data);
            } catch (error) {
                HandleResponse({error})
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [currentDate, api]);

    const bookingsByDate = rooms.reduce((acc, room) => {
        room.peminjaman.forEach(booking => {
            if (['DISETUJUI', 'SELESAI', 'DIPROSES'].includes(booking.status)) {
                const startDate = parseISO(booking.tanggal_mulai);
                const endDate = booking.tanggal_selesai ? parseISO(booking.tanggal_selesai) : startDate;

                eachDayOfInterval({ start: startDate, end: endDate }).forEach(date => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    if (!acc[dateStr]) acc[dateStr] = [];
                    acc[dateStr].push({
                        ...booking,
                        room: { 
                            nama_ruangan: room.nama_ruangan,
                            lokasi_ruangan: room.lokasi_ruangan,
                            foto_ruangan: room.foto_ruangan,
                            kapasitas: room.kapasitas,
                            deskripsi: room.deskripsi
                        }
                    });
                });
            }
        });
        return acc;
    }, {});

    return {
        currentDate,
        setCurrentDate,
        rooms,
        loading,
        selectedBooking,
        setSelectedBooking,
        expandedCells,
        setExpandedCells,
        bookingsByDate
    };
};
```

### useResponsive

Custom hook untuk mengelola state responsive design:

```jsx
// hooks/useResponsive.js
import { useState, useEffect } from 'react';

const breakpoints = {
  mobile: 640,  
  tablet: 768, 
  desktop: 1024 
};

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: windowSize.width ? windowSize.width < breakpoints.mobile : false,
    isTablet: windowSize.width ? windowSize.width >= breakpoints.mobile && windowSize.width < breakpoints.desktop : false,
    isDesktop: windowSize.width ? windowSize.width >= breakpoints.desktop : false,
    width: windowSize.width,
    height: windowSize.height
  };
};
```

## Praktik Terbaik dan Pola

### 1. State Colocation

Kami berusaha menyimpan state sedekat mungkin dengan komponen yang membutuhkannya, mengangkatnya ke level yang lebih tinggi hanya ketika diperlukan oleh beberapa komponen.

### 2. State Derivation vs State Duplication

Kami mengutamakan menderivasikan state daripada menduplikasinya:

```jsx
// Contoh menderivasikan state
const completedBookings = bookings.filter(booking => booking.status === 'SELESAI');
const approvedBookings = bookings.filter(booking => booking.status === 'DISETUJUI');
```

### 3. State Normalization

Untuk data kompleks yang berhubungan, kami menggunakan normalisasi untuk menghindari duplikasi dan inkonsistensi:

```jsx
// Contoh potensial normalisasi state
const state = {
  rooms: {
    byId: {
      'room1': { id: 'room1', name: 'Ruang Rapat 1', ... },
      'room2': { id: 'room2', name: 'Ruang Rapat 2', ... },
    },
    allIds: ['room1', 'room2']
  },
  bookings: {
    byId: {
      'booking1': { id: 'booking1', roomId: 'room1', ... },
      'booking2': { id: 'booking2', roomId: 'room2', ... },
    },
    allIds: ['booking1', 'booking2']
  }
};
```

### 4. State Immutability

Kami selalu memperlakukan state sebagai immutable, menggunakan fungsi pembaruan dengan spread operator atau fungsi pembantu lainnya:

```jsx
// Update state dengan immutability
setFormData(prev => ({
  ...prev,
  [name]: value
}));
```

## Ringkasan

Strategi state management di RuangIn dirancang dengan fokus pada:

1. **Modularitas**: Setiap jenis state memiliki tempat yang tepat
2. **Prediktabilitas**: Perubahan state terjadi dengan pola yang konsisten
3. **Performa**: Minimalisasi rendering yang tidak perlu
4. **Developer Experience**: Pattern yang mudah dipahami dan dilacak

Pendekatan ini memungkinkan aplikasi untuk berskala dengan mudah dan mempertahankan maintainability ketika kompleksitas meningkat.