# Dokumentasi API: Autentikasi

Dokumentasi ini menjelaskan endpoint API yang berhubungan dengan autentikasi pengguna di sistem peminjaman ruang rapat.

## Daftar Isi

- [Login](#login)
- [Logout](#logout)
- [Mendaftarkan Pengguna Baru](#mendaftarkan-pengguna-baru)

## Login

Mengautentikasi pengguna dan mengembalikan token JWT.

- **URL**: `/api/v1/login`
- **Metode**: `POST`
- **Autentikasi**: Tidak
- **Hak Akses**: Tidak ada

**Request Body**:

```json
{
  "email": "user@example.com",
  "kata_sandi": "Password123!"
}
```

**Respon Sukses (200)**:

```json
{
  "status": true,
  "message": "Login successful",
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
    },
    "token": "jwt-token-string"
  }
}
```

**Respon Error**:

- **401 Unauthorized**:
  ```json
  {
    "error": true,
    "message": "Wrong password"
  }
  ```

- **404 Not Found**:
  ```json
  {
    "error": true,
    "message": "User not found"
  }
  ```

### Validasi

- Email harus berformat email yang valid
- Kata sandi harus minimal 8 karakter, mengandung minimal satu huruf besar, satu huruf kecil, dan satu karakter khusus

## Logout

Mengeluarkan pengguna dengan menginvalidasi token JWT mereka.

- **URL**: `/api/v1/logout`
- **Metode**: `POST`
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
  "message": "Logout successful"
}
```

**Respon Error**:

- **401 Unauthorized**:
  ```json
  {
    "error": true,
    "message": "You are unauthorized, please login first"
  }
  ```

## Mendaftarkan Pengguna Baru

Mendaftarkan pengguna baru (khusus Admin).

- **URL**: `/api/v1/register`
- **Metode**: `POST`
- **Autentikasi**: Ya
- **Hak Akses**: SUPERADMIN

**Headers**:

```
Authorization: Bearer {token}
```

**Request Body**:

```json
{
  "nama_lengkap": "Pengguna Baru",
  "email": "penggunabaru@example.com",
  "role": "PEMINJAM",
  "kontak": "+628123456789",
  "tim_kerja_id": "uuid-string"
}
```

**Respon Sukses (201)**:

```json
{
  "status": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid-string",
    "nama_lengkap": "Pengguna Baru",
    "email": "penggunabaru@example.com",
    "role": "PEMINJAM"
  }
}
```

**Respon Error**:

- **400 Bad Request**:
  ```json
  {
    "error": true,
    "message": "Email already registered"
  }
  ```
  
  atau
  
  ```json
  {
    "error": true,
    "message": "Tim kerja ini sudah memiliki akun terdaftar dengan email: user@example.com"
  }
  ```

- **403 Forbidden**:
  ```json
  {
    "error": true,
    "message": "You do not have permission to perform this action"
  }
  ```

### Catatan

- Kata sandi default yang ditetapkan untuk pengguna baru adalah `@Test123!`
- Peran yang tersedia adalah `SUPERADMIN`, `ADMIN`, dan `PEMINJAM`
- Hanya dapat ada satu pengguna dengan peran `SUPERADMIN` dan satu dengan peran `ADMIN`
- Satu tim kerja hanya dapat memiliki satu akun pengguna