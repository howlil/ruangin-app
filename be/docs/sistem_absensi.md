# Dokumentasi API: Sistem Absensi

Dokumentasi ini menjelaskan endpoint API yang berhubungan dengan sistem absensi untuk peminjaman ruang rapat.

## Daftar Isi

- [Mendapatkan Detail Absensi](#mendapatkan-detail-absensi)
- [Mengirimkan Absensi](#mengirimkan-absensi)
- [Mendapatkan Daftar Absensi](#mendapatkan-daftar-absensi)
- [Mengekspor Absensi ke PDF](#mengekspor-absensi-ke-pdf)
- [Mengekspor Absensi ke Excel](#mengekspor-absensi-ke-excel)

## Mendapatkan Detail Absensi

Mengembalikan detail absensi berdasarkan kode unik.

- **URL**: `/api/v1/absensi/:kode`
- **Metode**: `GET`
- **Autentikasi**: Tidak
- **Hak Akses**: Tidak ada

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Success get absensi detail",
  "data": {
    "peminjaman": {
      "nama_kegiatan": "Rapat Direksi",
      "tanggal": "2025-04-28",
      "jam_mulai": "09:00",
      "jam_selesai": "12:00",
      "ruang_rapat": "Ruang Rapat A"
    },
    "id": "uuid-string"
  }
}
```

**Respon Error**:

- **404 Not Found**:
  ```json
  {
    "error": true,
    "message": "Absensi not found"
  }
  ```

### Catatan

- Kode unik diperoleh dari URL absensi yang dikirimkan ke peserta
- Endpoint ini tidak memerlukan autentikasi untuk memudahkan akses peserta rapat

## Mengirimkan Absensi

Mengirimkan data absensi peserta rapat.

- **URL**: `/api/v1/absensi/:kode`
- **Metode**: `POST`
- **Autentikasi**: Tidak
- **Hak Akses**: Tidak ada

**Request Body**:

```json
{
  "nama": "Nama Peserta",
  "unit_kerja": "Divisi IT",
  "golongan": "III/a",
  "jabatan": "Staff",
  "tanda_tangan": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "jenis_kelamin": "LAKI_LAKI"
}
```

**Respon Sukses (201)**:

```json
{
  "status": true,
  "message": "Success submit absensi",
  "data": {
    "id": "uuid-string",
    "absensi_id": "uuid-string",
    "nama": "Nama Peserta",
    "unit_kerja": "Divisi IT",
    "golongan": "III/a",
    "jabatan": "Staff",
    "tanda_tangan": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "jenis_kelamin": "LAKI_LAKI"
  }
}
```

**Respon Error**:

- **400 Bad Request**:
  ```json
  {
    "error": true,
    "message": "Meeting Belum Dimulai"
  }
  ```
  
  atau
  
  ```json
  {
    "error": true,
    "message": "Meeting Sudah selesai"
  }
  ```

- **404 Not Found**:
  ```json
  {
    "error": true,
    "message": "Absensi not found"
  }
  ```

### Validasi dan Catatan

- Field `tanda_tangan` harus berupa string base64 dari gambar tanda tangan
- Field `jenis_kelamin` harus berupa salah satu dari: `LAKI_LAKI` atau `PEREMPUAN`
- Absensi hanya dapat dilakukan selama waktu rapat (antara jam mulai dan jam selesai)
- Sejak versi terbaru, field `no_hp` opsional untuk absensi

## Mendapatkan Daftar Absensi

Mengembalikan daftar peserta yang sudah absen untuk rapat tertentu.

- **URL**: `/api/v1/absensi/:kode/list`
- **Metode**: `GET`
- **Autentikasi**: Tidak
- **Hak Akses**: Tidak ada

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Success get list absensi",
  "data": {
    "peminjaman": {
      "nama_kegiatan": "Rapat Direksi",
      "tanggal": "2025-04-28",
      "jam_mulai": "09:00",
      "jam_selesai": "12:00",
      "ruang_rapat": "Ruang Rapat A"
    },
    "list_absensi": [
      {
        "id": "uuid-string",
        "absensi_id": "uuid-string",
        "nama": "Peserta 1",
        "unit_kerja": "Divisi IT",
        "golongan": "III/a",
        "jabatan": "Staff",
        "tanda_tangan": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
        "jenis_kelamin": "LAKI_LAKI"
      },
      {
        "id": "uuid-string",
        "absensi_id": "uuid-string",
        "nama": "Peserta 2",
        "unit_kerja": "Divisi Keuangan",
        "golongan": "III/c",
        "jabatan": "Supervisor",
        "tanda_tangan": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
        "jenis_kelamin": "PEREMPUAN"
      }
    ]
  }
}
```

**Respon Error**:

- **404 Not Found**:
  ```json
  {
    "error": true,
    "message": "Absensi not found"
  }
  ```

### Catatan

- Endpoint ini tidak memerlukan autentikasi untuk memudahkan akses peserta rapat
- Daftar absensi mencakup semua peserta yang sudah mengirimkan data absensi

## Mengekspor Absensi ke PDF

Mengekspor daftar hadir rapat dalam format PDF.

- **URL**: `/api/v1/absensi/:kode/export`
- **Metode**: `GET`
- **Autentikasi**: Tidak
- **Hak Akses**: Tidak ada

**Respon Sukses**:
- File PDF dengan header `Content-Type: application/pdf`
- Header `Content-Disposition: attachment; filename="daftar-hadir-{kode}.pdf"`

**Respon Error**:

- **404 Not Found**:
  ```json
  {
    "error": true,
    "message": "Absensi not found"
  }
  ```

### Catatan

- Endpoint mengembalikan dokumen PDF langsung, bukan respons JSON
- PDF berisi header dengan informasi rapat dan tabel daftar hadir
- Tanda tangan peserta ditampilkan dalam dokumen PDF
- Format dokumen sesuai dengan standar daftar hadir rapat resmi

## Mengekspor Absensi ke Excel

Mengekspor daftar hadir rapat dalam format Excel.

- **URL**: `/api/v1/absensi/:kode/excel`
- **Metode**: `GET`
- **Autentikasi**: Tidak
- **Hak Akses**: Tidak ada

**Respon Sukses**:
- File Excel dengan header `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Header `Content-Disposition: attachment; filename="daftar-hadir-{kode}.xlsx"`

**Respon Error**:

- **404 Not Found**:
  ```json
  {
    "error": true,
    "message": "Absensi not found"
  }
  ```

### Catatan

- Endpoint mengembalikan dokumen Excel langsung, bukan respons JSON
- Excel berisi header dengan informasi rapat dan tabel daftar hadir
- Tanda tangan tidak ditampilkan dalam file Excel
- File Excel mencakup kolom tambahan `no_hp` (jika tersedia)
- Format dokumen sesuai dengan standar daftar hadir rapat resmi