# RuangIn - Sistem Peminjaman Ruangan


## Pengantar

**RuangIn** adalah sistem manajemen peminjaman ruangan rapat yang didesain khusus untuk Pusat Data dan Informasi Kementerian Kelautan dan Perikanan Republik Indonesia. Aplikasi ini memungkinkan pengelolaan peminjaman ruangan rapat secara efisien dengan fitur yang lengkap dan antarmuka yang responsif.


## Fitur Utama

- 🏢 Manajemen ruangan termasuk detail kapasitas dan fasilitas
- 📅 Pemesanan ruangan dengan verifikasi jadwal
- 👥 Sistem manajemen pengguna dengan level akses berbeda
- 📝 Fitur pencatatan kehadiran di rapat (absensi)
- 📊 Pelaporan penggunaan ruangan
- 📱 Antarmuka responsif untuk semua ukuran perangkat

## Teknologi

- **Frontend**: React 18, Vite, Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router v7
- **UI Components**: Headless UI, Shadcn-inspired components
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Pemformatan Tanggal**: date-fns, dayjs
- **Visualisasi Data**: Chart.js, Recharts
- **Validasi Form**: Custom validation
- **Animasi**: Framer Motion

## Struktur Direktori

```
fe/
├── src/
│   ├── assets/         # Statis aset (gambar, font)
│   ├── components/     # Komponen yang dapat digunakan kembali
│   ├── contexts/       # React context untuk state management
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility dan helper functions
│   ├── pages/          # Komponen halaman
│   ├── routes/         # Konfigurasi routing
│   ├── utils/          # Fungsi utilitas (auth, format, dll)
│   ├── index.css       # Global CSS
│   └── main.jsx        # Entry point
├── docs/               # Dokumentasi proyek
├── public/             # Static files yang tidak diproses oleh Vite
├── vite.config.js      # Konfigurasi Vite
├── tailwind.config.js  # Konfigurasi Tailwind CSS
└── package.json        # Dependencies dan scripts
```

## Pengguna dan Peran

Sistem memiliki tiga tipe pengguna:

1. **PEMINJAM**: Dapat meminjam ruangan dan melihat jadwal/status peminjaman
2. **ADMIN**: Dapat mengelola peminjaman dan menyetujui permintaan
3. **SUPERADMIN**: Dapat mengelola seluruh aspek sistem termasuk pengguna dan pengaturan

## Panduan Dokumentasi

Dokumentasi lengkap tersedia di folder `docs/`. Daftar dokumen:

- [Arsitektur Aplikasi](docs/arsitektur.md)
- [State Management](docs/state-management.md)
- [Routing dan Navigasi](docs/routing.md)
- [Komponen Sistem](docs/komponen.md)
- [Integrasi API](docs/api-integration.md)
- [Responsive Design](docs/responsive-design.md)

## Memulai

### Prasyarat

- Node.js (v16 atau lebih baru)
- npm atau yarn

### Instalasi

```bash
# Clone repository
git clone https://github.com/username/ruangin.git
cd ruangin

# Install dependencies
npm install

# Jalankan server development
npm run dev
```

### Build untuk Produksi

```bash
npm run build
```

