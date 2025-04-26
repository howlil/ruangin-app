# Dokumentasi API: Manajemen Pengguna

Dokumentasi ini menjelaskan endpoint API yang berhubungan dengan manajemen pengguna di sistem peminjaman ruang rapat.

## Daftar Isi

- [Mendapatkan Informasi Pengguna Saat Ini](#mendapatkan-informasi-pengguna-saat-ini)
- [Mendapatkan Semua Pengguna](#mendapatkan-semua-pengguna)
- [Memperbarui Pengguna](#memperbarui-pengguna)
- [Menghapus Pengguna](#menghapus-pengguna)

## Mendapatkan Informasi Pengguna Saat Ini

Mengembalikan informasi pengguna yang saat ini terautentikasi.

- **URL**: `/api/v1/me`
- **Metode**: `GET`
- **Autentikasi**: Ya
- **Hak Akses**: Semua pengguna terautentikasi

**Headers**:

```
Authorization: Bearer {token}
```

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Current user data retrieved successfully",
  "data": {
    "id": "uuid-string",
    "nama_lengkap": "Nama Pengguna",
    "email": "user@example.com",
    "role": "PEMINJAM",
    "detail_pengguna": {
      "id": "uuid-string",
      "kontak": "+628123456789",
      "tim_kerja": {
        "id": "uuid-string",
        "nama_tim_kerja": "Nama Tim",
        "code": "TM01",
        "is_aktif": true
      }
    }
  }
}
```

## Mendapatkan Semua Pengguna

Mengembalikan daftar semua pengguna dengan pagination.

- **URL**: `/api/v1/pengguna`
- **Metode**: `GET`
- **Autentikasi**: Ya
- **Hak Akses**: Semua pengguna terautentikasi
- **Parameter Query**:
  - `page` (opsional, default=1): Nomor halaman
  - `size` (opsional, default=10): Jumlah item per halaman

**Headers**:

```
Authorization: Bearer {token}
```

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Users data retrieved successfully",
  "data": [
    {
      "id": "uuid-string",
      "nama_lengkap": "Nama Pengguna",
      "email": "user@example.com",
      "role": "PEMINJAM",
      "detail": {
        "kontak": "+628123456789",
        "tim_kerja": "Nama Tim",
        "tim_kerja_id": "uuid-string"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "size": 10,
    "total_rows": 25,
    "total_pages": 3
  }
}
```

### Catatan

- Hasil hanya menampilkan pengguna dengan peran `ADMIN` dan `PEMINJAM`
- Pengguna `SUPERADMIN` tidak ditampilkan dalam daftar

## Memperbarui Pengguna

Memperbarui informasi pengguna.

- **URL**: `/api/v1/users/:userId` (untuk SUPERADMIN) atau `/api/v2/users` (untuk pembaruan diri sendiri)
- **Metode**: `PATCH`
- **Autentikasi**: Ya
- **Hak Akses**: SUPERADMIN (untuk semua pengguna) atau PEMINJAM (untuk pembaruan diri sendiri)

**Headers**:

```
Authorization: Bearer {token}
```

**Request Body** (semua field bersifat opsional):

```json
{
  "nama_lengkap": "Nama Diperbarui",
  "email": "updated@example.com",
  "role": "PEMINJAM",
  "kontak": "+628987654321",
  "tim_kerja_id": "uuid-string"
}
```

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "User updated successfully",
  "data": {
    "id": "uuid-string",
    "nama_lengkap": "Nama Diperbarui",
    "email": "updated@example.com",
    "role": "PEMINJAM"
  }
}
```

**Respon Error**:

- **400 Bad Request**:
  ```json
  {
    "error": true,
    "message": "Another user with role ADMIN already exists"
  }
  ```
  
  atau
  
  ```json
  {
    "error": true,
    "message": "Tim kerja ini sudah memiliki akun terdaftar dengan email: user@example.com"
  }
  ```

- **404 Not Found**:
  ```json
  {
    "error": true,
    "message": "User not found"
  }
  ```

### Catatan

- Untuk pengguna PEMINJAM yang memperbarui informasi mereka sendiri, gunakan endpoint `/api/v2/users`
- Untuk administrator yang memperbarui informasi pengguna lain, gunakan endpoint `/api/v1/users/:userId`
- Hanya dapat ada satu pengguna dengan peran `ADMIN`
- Jika peran pengguna diubah menjadi `SUPERADMIN` atau `ADMIN`, mereka kehilangan detail pengguna dan tim kerja
- Jika peran pengguna diubah menjadi `PEMINJAM`, detail pengguna dan tim kerja harus ditentukan

## Menghapus Pengguna

Menghapus pengguna dari sistem.

- **URL**: `/api/v1/users/:userId`
- **Metode**: `DELETE`
- **Autentikasi**: Ya
- **Hak Akses**: SUPERADMIN

**Headers**:

```
Authorization: Bearer {token}
```

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "User successfully deleted"
}
```

**Respon Error**:

- **400 Bad Request**:
  ```json
  {
    "error": true,
    "message": "Cannot delete user with active loans"
  }
  ```
  
  atau
  
  ```json
  {
    "error": true,
    "message": "Cannot delete SUPERADMIN account"
  }
  ```

- **404 Not Found**:
  ```json
  {
    "error": true,
    "message": "User not found"
  }
  ```

### Catatan

- Akun `SUPERADMIN` tidak dapat dihapus
- Pengguna dengan peminjaman aktif (status `DIPROSES` atau `DISETUJUI`) tidak dapat dihapus
- Menghapus pengguna juga akan menghapus semua detail pengguna, token, dan peminjaman dengan status `DITOLAK` atau `SELESAI`