# Komponen Sistem RuangIn

## Pendahuluan

Dokumen ini memberikan gambaran lengkap tentang arsitektur komponen dalam sistem RuangIn. Sistem ini dibangun menggunakan pendekatan berbasis komponen dengan React sebagai fondasi utama. Komponen-komponen ini dirancang dengan prinsip reusability, composability, dan separation of concerns untuk memastikan kualitas kode dan kemudahan pemeliharaan.

## Hierarki Komponen

RuangIn memiliki hierarki komponen yang terstruktur sebagai berikut:

```
├── Layout Components
│   ├── DashboardLayout
│   └── MainLayout
├── Page Components
│   ├── Admin Pages
│   └── User Pages
├── Feature Components
│   ├── Booking
│   ├── Calendar
│   ├── Room Management
│   └── User Management
├── Shared Components
│   ├── Navigation
│   ├── Forms
│   └── Feedback
└── UI Components
    ├── Buttons
    ├── Inputs
    ├── Modals
    └── Cards
```

## Komponen Inti

### 1. Layout Components

Layout Components menyediakan struktur untuk berbagai halaman dalam aplikasi, memastikan konsistensi antarmuka pengguna.

#### DashboardLayout

**Deskripsi**: Komponen layout utama untuk halaman admin, menyediakan navigasi sidebar dengan kontrol responsif. Layout ini menampilkan sidebar yang dapat dikecilkan untuk perangkat mobile dan header dengan menu pengguna.

**Fitur Utama**:
- Sidebar responsif (collapsed pada mobile)
- Header dengan menu user
- Deteksi rute aktif
- Loading state

#### MainLayout

**Deskripsi**: Komponen layout untuk halaman publik dan halaman pengguna biasa. Layout ini menyediakan navigasi atas dengan navbar dan footer yang konsisten di seluruh halaman publik.

**Fitur Utama**:
- Navbar dengan menu navigasi
- Footer konsisten
- Container untuk konten utama

### 2. UI Components

UI Components adalah building blocks dasar yang membentuk antarmuka aplikasi. Komponen ini dirancang untuk menjadi reusable, konsisten, dan dapat dikonfigurasi.

#### Button

**Deskripsi**: Komponen button yang sangat dapat dikonfigurasi dengan berbagai variant, styles dan states.

**Fitur Utama**:
- Multiple variants: primary, secondary
- Multiple colors: blue, red, green
- Support untuk icon
- Loading state
- Full width mode
- Disabled state

#### Input

**Deskripsi**: Komponen input form yang dapat dikonfigurasi dengan berbagai jenis input, validasi dan styling.

**Fitur Utama**:
- Support untuk berbagai tipe input (text, password, date, dll)
- Toggle visibility untuk password
- Label dan helper text
- Error state
- Icon awalan dan akhiran
- Full width mode
- Disabled state

#### Card

**Deskripsi**: Komponen container dengan styling yang konsisten untuk menampilkan konten dalam card. Menyediakan subkomponen untuk struktur card yang terorganisir.

**Fitur Utama**:
- Beberapa variant styling: default, elevated, flat, outlined
- Hover effects
- Subkomponen: CardHeader, CardTitle, CardDescription, CardContent, CardFooter

#### Dialog / Modal

**Deskripsi**: Komponen overlay untuk menampilkan konten yang membutuhkan perhatian pengguna atau interaksi.

**Fitur Utama**:
- Animation masuk dan keluar
- Beberapa ukuran: sm, md, lg, xl, xxl
- Support untuk judul dan deskripsi
- Dismissable dengan klik tombol close

#### Table

**Deskripsi**: Komponen table yang fleksibel dengan support untuk data grid dan tampilan responsif.

**Fitur Utama**:
- View desktop dan mobile yang berbeda
- Card-based view untuk mobile
- Action menu untuk setiap baris
- Loading state
- Empty state
- Pagination terintegrasi
- Customizable cell rendering

### 3. Form Components

Form components untuk manajemen berbagai input dan penanganan formulir.

#### SignatureCanvas

**Deskripsi**: Komponen canvas yang memungkinkan pengguna untuk memberikan tanda tangan digital dengan mouse atau touch.

**Fitur Utama**:
- Support untuk input touch dan mouse
- Reset functionality
- Base64 output untuk data tanda tangan
- Garis referensi untuk posisi tanda tangan
- Responsif terhadap ukuran container

### 4. Interaction Components

Komponen yang menangani interaksi pengguna yang lebih kompleks seperti animasi, ekspansi, dll.

#### CustomAccordion

**Deskripsi**: Accordion component untuk menampilkan informasi dalam format yang dapat expand/collapse.

**Fitur Utama**:
- Animasi expand/collapse yang smooth
- Support untuk multiple accordion items
- Hanya satu item yang dapat terbuka pada satu waktu
- Styling hover dan active states

#### AnimatedGridPattern

**Deskripsi**: Komponen dekoratif yang menciptakan animasi grid pattern untuk latar belakang.

**Fitur Utama**:
- Kotak-kotak yang beranimasi dengan fade in/out
- Posisi kotak yang acak
- Delay offset untuk setiap kotak
- Customizable density, ukuran, dan durasi

### 5. Feedback Components

Komponen yang memberikan feedback kepada pengguna, seperti notifikasi, toasts, dll.

#### HandleResponse

**Deskripsi**: Utility component untuk menangani respons API dan menampilkan feedback yang sesuai kepada pengguna.

**Fitur Utama**:
- Handling berbagai jenis respons API
- Support untuk pesan sukses dan error
- Handling multiple error messages
- Fallback untuk berbagai kasus error

#### Toast

**Deskripsi**: Sistem notifikasi non-intrusive untuk memberikan feedback kepada pengguna.

**Fitur Utama**:
- Beberapa tipe toast: success, error, warning, info
- Toast dengan promise untuk operasi async
- Toast dengan action buttons
- Customizable styling dan durasi

### 6. Navigation Components

Komponen yang menangani navigasi aplikasi.

#### Navbar

**Deskripsi**: Komponen header utama untuk layout publik, dengan navigasi responsif dan menu pengguna.

**Fitur Utama**:
- Desktop dan mobile view
- User menu dengan dropdown
- Support untuk pencarian
- Transparansi yang berubah saat scroll
- Dropdown untuk ruangan

#### Sidebar

**Deskripsi**: Komponen navigasi untuk admin dashboard dengan menu dinamis berdasarkan peran pengguna.

**Fitur Utama**:
- Filtering menu berdasarkan izin pengguna
- Toggle visibility untuk mobile
- Highlight item aktif
- Animasi transisi

### 7. Feature Components

Feature components menangani aspek bisnis spesifik dari aplikasi, seperti booking, manajemen ruangan, dll.

#### BookingCard

**Deskripsi**: Card untuk menampilkan data peminjaman ruangan dengan aksi terkait.

**Fitur Utama**:
- Layout responsif
- Support untuk view detail peminjaman
- Status peminjaman dengan visual cues
- Link absensi yang dapat disalin
- Export untuk data absensi

#### BookingCalendar

**Deskripsi**: Komponen kalender khusus untuk menampilkan dan memilih tanggal peminjaman ruangan.

**Fitur Utama**:
- Highlight tanggal dengan peminjaman yang ada
- Color-coding untuk status peminjaman
- Indikator hari ini
- Disabled dates untuk tanggal yang sudah lewat
- Legend untuk status

#### DateRangePicker

**Deskripsi**: Komponen untuk memilih rentang tanggal untuk filter dan peminjaman.

**Fitur Utama**:
- Pemilihan dua tanggal (mulai dan selesai)
- Support untuk single date selection
- Filter mode untuk pencarian
- Reset functionality
- Format tanggal yang konsisten

#### RoomCard

**Deskripsi**: Card untuk menampilkan informasi ruangan dengan gambar dan detailnya.

**Fitur Utama**:
- Gambar ruangan
- Detail kapasitas dan lokasi
- Action button untuk detail/peminjaman
- Hover effects
- Truncate untuk teks yang panjang

### 8. Admin Page Components

Komponen-komponen spesifik untuk halaman admin.

#### StatisticBox

**Deskripsi**: Komponen untuk menampilkan statistik dalam bentuk card dengan icon.

**Fitur Utama**:
- Icon yang dapat dikonfigurasi
- Color schemes berbeda untuk setiap statistik
- Hover effect
- Styling yang konsisten

#### StatisticsChart

**Deskripsi**: Komponen chart untuk visualisasi data statistik peminjaman.

**Fitur Utama**:
- Bar chart untuk perbandingan data
- Legend dan tooltip
- Loading state
- Empty state
- Responsive width

#### RoomManagement

**Deskripsi**: Komponen untuk mengelola data ruangan dengan tabel dan aksi CRUD.

**Fitur Utama**:
- Tabel dengan informasi ruangan
- Modal untuk tambah/edit ruangan
- Upload gambar ruangan
- Konfirmasi hapus
- Detail view

#### UserManagement

**Deskripsi**: Komponen untuk mengelola data pengguna dengan tabel dan aksi CRUD.

**Fitur Utama**:
- Tabel dengan informasi pengguna
- Modal untuk tambah/edit pengguna
- Role assignment
- Tim kerja assignment
- Status pengguna

### 9. User Page Components

Komponen-komponen spesifik untuk halaman pengguna.

#### BookingDialog

**Deskripsi**: Modal dialog untuk melihat dan membuat peminjaman ruangan.

**Fitur Utama**:
- Form untuk detail peminjaman
- Validasi tanggal dan waktu
- Time picker
- Konfirmasi submit
- Loading state

#### BookingHistoryList

**Deskripsi**: Komponen untuk menampilkan riwayat peminjaman pengguna.

**Fitur Utama**:
- Filter berdasarkan status
- Detail peminjaman
- Link ke absensi
- Export data absensi
- Pagination

#### RoomScheduleList

**Deskripsi**: Komponen untuk menampilkan jadwal penggunaan ruangan.

**Fitur Utama**:
- Animasi scroll otomatis
- Indikator status peminjaman
- Responsif untuk berbagai ukuran layar
- Empty state

#### AbsensiForm

**Deskripsi**: Form untuk mengisi data kehadiran dalam rapat.

**Fitur Utama**:
- Input data peserta
- Signature canvas untuk tanda tangan digital
- Validasi input
- Status submit

## Praktik Terbaik Komponen

RuangIn mengimplementasikan praktik terbaik dalam pengembangan komponen React:

### Composition over Inheritance

Komponen-komponen RuangIn menggunakan pattern komposisi untuk memaksimalkan reusabilitas. Contohnya, `Card` menggunakan sub-komponen seperti `CardHeader`, `CardTitle`, dll.

### Props Drilling Prevention

Untuk mencegah props drilling yang berlebihan, RuangIn menggunakan React Context untuk state global, dan pattern Parent-Child untuk state yang lebih terlokalisasi.

### Separation of Concerns

Komponen RuangIn memisahkan dengan jelas antara presentational components (UI) dan container components (logika).

### Consistent Naming Convention

Semua komponen mengikuti konvensi penamaan yang konsisten:
- PascalCase untuk nama komponen
- camelCase untuk props
- Suffix tertentu untuk tipe komponen (misalnya: Modal, Card, Button)

### Defensive Programming
