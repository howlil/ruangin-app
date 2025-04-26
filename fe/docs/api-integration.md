# Integrasi API di RuangIn

## Pendahuluan

Dokumen ini menjelaskan bagaimana aplikasi RuangIn mengintegrasikan diri dengan backend API. Integrasi API adalah aspek kritis dari aplikasi, karena memungkinkan komunikasi antara frontend dan backend, sehingga aplikasi dapat mengelola dan menampilkan data secara dinamis.

## Arsitektur Komunikasi API

RuangIn menggunakan pola arsitektur client-server untuk komunikasi API:

```
┌─────────────────┐                 ┌─────────────────┐
│                 │                 │                 │
│  React Frontend │ ◄─── HTTP ─────►│   REST API      │
│    (Client)     │                 │    (Server)     │
│                 │                 │                 │
└─────────────────┘                 └─────────────────┘
```

### Teknologi

- **HTTP Client**: Axios
- **Data Format**: JSON
- **Authentication**: JWT (JSON Web Token)
- **Error Handling**: Centralized pattern

## Konfigurasi Axios

### Setup Dasar

RuangIn menggunakan axios untuk semua komunikasi HTTP dengan backend. Konfigurasi axios dilakukan di file `utils/api.js` yang mengekspor instance axios yang telah dikonfigurasi untuk digunakan di seluruh aplikasi.

Konfigurasi dasar meliputi:
- Base URL dari API 
- Headers default
- Opsi credentials

### Interceptors

Implementasi interceptors digunakan untuk menangani aspek komunikasi HTTP yang umum, seperti:

1. **Request Interceptor**: Menambahkan token autentikasi ke setiap request
2. **Response Interceptor**: Menangani error umum seperti 401 (Unauthorized)

Dengan pendekatan ini, kode bisnis tidak perlu secara eksplisit menangani aspek-aspek tersebut setiap kali melakukan request API.

## Autentikasi dan Otorisasi

### JWT Authentication

RuangIn menggunakan JWT untuk autentikasi. Setelah login berhasil:

1. Token JWT disimpan di localStorage
2. Token juga di-encrypt dan disimpan dalam cookie untuk persistensi
3. Token ditambahkan ke setiap request API melalui request interceptor

### Token Management

Token management meliputi:
- **Penyimpanan**: LocalStorage dan cookies terenkripsi
- **Pengambilan**: Saat startup aplikasi dan setelah login
- **Refresh**: Saat ini implementasi tidak menyertakan refresh token
- **Pencabutan**: Token dihapus saat logout

## Penanganan Error

### Centralized Error Handling

RuangIn menggunakan pattern penanganan error terpusat melalui komponen `HandleResponse`. Komponen ini menangani berbagai jenis kesalahan dan respons API, menyederhanakan kode panggilan API.

Fungsi ini menangani berbagai skenario:
- Respons sukses (200, 201)
- Error dengan data respons
- Error dengan pesan sederhana
- Error tanpa respons
- Multiple errors dalam suatu respons

### Tampilan Error

Untuk menampilkan error ke pengguna, RuangIn menggunakan library Toast untuk notifikasi non-intrusive. Format pesan error dirancang untuk:
- Ringkas dan jelas
- Menunjukkan tindakan yang perlu diambil (jika ada)
- Menggunakan bahasa yang dimengerti pengguna

## Struktur Endpoint API

Aplikasi RuangIn berinteraksi dengan beberapa endpoint API yang dikelompokkan berdasarkan domain.

### Endpoint Autentikasi

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/v1/login` | POST | Autentikasi pengguna |
| `/v1/logout` | POST | Logout pengguna |
| `/v1/register` | POST | Registrasi pengguna baru (admin only) |

### Endpoint Ruangan

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/v1/ruang-rapat` | GET | Mendapatkan daftar ruangan |
| `/v1/ruang-rapat/:id` | GET | Mendapatkan detail ruangan |
| `/v1/ruang-rapat` | POST | Membuat ruangan baru |
| `/v1/ruang-rapat/:id` | PATCH | Memperbarui ruangan |
| `/v1/ruang-rapat/:id` | DELETE | Menghapus ruangan |
| `/v1/check` | POST | Memeriksa ketersediaan ruangan |

### Endpoint Peminjaman

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/v1/peminjaman` | GET | Mendapatkan daftar peminjaman pengguna |
| `/v1/peminjaman` | POST | Membuat peminjaman baru |
| `/v1/peminjaman/:id` | GET | Mendapatkan detail peminjaman |
| `/v1/peminjaman/:id/status` | PATCH | Memperbarui status peminjaman |
| `/v2/peminjaman` | GET | Mendapatkan daftar peminjaman (admin) |
| `/v2/peminjaman/diproses` | GET | Mendapatkan daftar peminjaman yang sedang diproses |

### Endpoint Absensi

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/v1/absensi/:kode` | GET | Mendapatkan detail absensi |
| `/v1/absensi/:kode` | POST | Mengisi absensi |
| `/v1/absensi/:kode/list` | GET | Mendapatkan daftar kehadiran |
| `/v1/absensi/:kode/export` | GET | Mengekspor absensi ke PDF |
| `/v1/absensi/:kode/excel` | GET | Mengekspor absensi ke Excel |

### Endpoint Tim Kerja

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/v1/tim-kerja` | GET | Mendapatkan daftar tim kerja |
| `/v1/tim-kerja` | POST | Membuat tim kerja baru |
| `/v1/tim-kerja/:id` | PATCH | Memperbarui tim kerja |
| `/v1/tim-kerja/:id` | DELETE | Menghapus tim kerja |

### Endpoint Statistik

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/v1/statistik` | GET | Mendapatkan statistik ruangan |
| `/v2/statistik` | GET | Mendapatkan statistik berdasarkan status |
| `/v1/display` | GET | Mendapatkan jadwal hari ini untuk display |

## Implementasi API Call

RuangIn menggunakan beberapa pola untuk implementasi API call.

### Pola Dasar

Pola dasar untuk panggilan API:

```javascript
// Pseudocode
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await api.get('/endpoint');
    setData(response.data.data);
    // Handle success case
  } catch (error) {
    HandleResponse({ error });
    // Handle error case
  } finally {
    setLoading(false);
  }
};
```

### Penggunaan dalam Komponen

Panggilan API biasanya dilakukan dalam useEffect hook atau event handler:

```javascript
// Pseudocode untuk useEffect
useEffect(() => {
  fetchData();
}, [dependencies]);

// Pseudocode untuk event handler
const handleSubmit = async () => {
  await submitData();
};
```

### Custom Hooks

Untuk logika API yang kompleks dan digunakan di beberapa tempat, RuangIn menggunakan custom hooks:

```javascript
// Pseudocode untuk custom hook
const useRoomData = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchRooms = useCallback(async () => {
    // Fetch logic
  }, []);
  
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);
  
  return { rooms, loading, refetch: fetchRooms };
};
```

## Caching dan Optimasi

### Optimasi Performa

RuangIn mengimplementasikan beberapa strategi untuk mengoptimasi performa API:

1. **Data Fetching berdasarkan kebutuhan**:
   - Data hanya diambil ketika diperlukan
   - Implementasi pagination untuk dataset besar

2. **Dependency Lists yang tepat**:
   - useEffect hooks dengan dependency arrays yang tepat
   - Hindari pengambilan data yang tidak perlu

3. **Loading States**:
   - UI feedback untuk pengguna selama proses loading
   - Placeholders/skeletons

### Debouncing dan Throttling

Untuk input pengguna seperti filter dan pencarian, RuangIn mengimplementasikan:
- Debouncing untuk input teks
- Throttling untuk operasi yang mahal secara komputasi

## Kasus Implementasi

Berikut adalah beberapa contoh implementasi API dalam RuangIn:

### Login User

Proses login user melibatkan:
- Panggilan API ke `/v1/login`
- Penyimpanan token JWT
- Update konteks pengguna
- Navigasi ke halaman yang sesuai berdasarkan peran

### Peminjaman Ruangan

Peminjaman ruangan melalui tahap:
- Validasi form input
- Panggilan API ke `/v1/peminjaman` dengan data form
- Handling respons (sukses atau error)
- Feedback kepada pengguna
- Navigasi ke halaman riwayat peminjaman pada sukses

### Dashboard Admin

Dashboard admin mendapatkan data melalui:
- Parallel API calls ke endpoint statistik
- Pembaruan UI berdasarkan filter tanggal
- Update chart dan statistik box secara dinamis

## File Upload

### Implementasi Upload

RuangIn mendukung upload file khususnya untuk gambar ruangan:

1. **Client Side**:
   - Input file dihandle dengan state
   - Preview gambar sebelum upload
   - Validasi tipe dan ukuran file

2. **Request ke Server**:
   - FormData digunakan untuk upload file
   - Content-Type: multipart/form-data

### Contoh Flow Upload

```
┌───────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│ File Input│    │ FormData   │    │ API Request│    │ Server     │
│ Change    │───►│ Creation   │───►│ (POST)     │───►│ Processing │
└───────────┘    └────────────┘    └────────────┘    └────────────┘
                        ▲
                        │
                  ┌─────────────┐
                  │ File Preview│
                  │ & Validation│
                  └─────────────┘
```

## Testing Integrasi API

### Pendekatan Testing

Integrasi API di RuangIn dapat diuji dengan beberapa pendekatan:

1. **Unit Testing**:
   - Test hook dan fungsi panggilan API secara terpisah
   - Mocking axios dan responses

2. **Integration Testing**:
   - Test alur lengkap dengan mock server
   - Memastikan integrasi antara komponen dan API berfungsi dengan baik

3. **End-to-End Testing**:
   - Test alur lengkap dengan backend yang sebenarnya
   - Fokus pada alur pengguna dan validasi data di UI

### Mock Data

Untuk testing, mock data yang realistis sangat penting. Contoh mock data untuk ruangan:

```javascript
const mockRooms = [
  {
    id: 1,
    nama_ruangan: "Ruang Rapat Utama",
    lokasi_ruangan: "Gedung A Lantai 3",
    kapasitas: 20,
    deskripsi: "Ruang rapat dengan fasilitas lengkap",
    foto_ruangan: "/uploads/rooms/room1.jpg"
  },
  // ... data lainnya
];
```

## Praktik Terbaik dan Panduan Pengembangan

### Praktik Terbaik

RuangIn mengikuti praktik terbaik ini untuk integrasi API:

1. **Separation of Concerns**:
   - Pisahkan logika API dari komponen UI
   - Gunakan custom hooks untuk logika data fetching

2. **Error Handling**:
   - Selalu tangani error dengan try-catch
   - Gunakan HandleResponse untuk konsistensi
   - Berikan feedback yang jelas kepada pengguna

3. **State Management**:
   - Gunakan loading state untuk feedback UI
   - Pisahkan data state dari UI state
   - Hindari data fetching berulang

4. **Security**:
   - Selalu validasi input di client-side
   - Jangan simpan data sensitif di state yang dapat diakses global
   - Gunakan HTTPS untuk semua komunikasi

5. **Performance**:
   - Minimize jumlah request
   - Gunakan pagination untuk dataset besar
   - Implement caching jika diperlukan

### Panduan Pengembangan

Saat mengembangkan fitur baru yang memerlukan integrasi API baru:

1. Tambahkan endpoint di `utils/api-constants.js` (jika ada)
2. Buat custom hook jika diperlukan untuk logika reusable
3. Implementasikan loading state dan error handling
4. Gunakan HandleResponse untuk error handling konsisten
5. Uji dengan berbagai skenario (happy path dan error cases)
