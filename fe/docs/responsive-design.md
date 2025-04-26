# Responsive Design di RuangIn

## Pendahuluan

Dokumen ini menjelaskan pendekatan responsive design yang diimplementasikan pada aplikasi RuangIn. Dengan meningkatnya penggunaan berbagai perangkat untuk mengakses aplikasi web, responsive design menjadi komponen kritis untuk memastikan pengalaman pengguna yang optimal di semua ukuran layar, mulai dari smartphone hingga desktop.

## Filosofi Responsive Design

RuangIn mengikuti filosofi "mobile-first" dalam pendekatannya terhadap responsive design. Hal ini berarti:

1. **Mobile-First Development**: Desain dan implementasi dimulai dari ukuran layar mobile, kemudian secara progresif ditingkatkan untuk layar yang lebih besar.
2. **Progressive Enhancement**: Fitur dan elemen UI ditambahkan secara bertahap seiring ukuran layar meningkat.
3. **Performance Oriented**: Pengoptimalan performa untuk perangkat mobile dengan koneksi yang lebih lambat.
4. **Fluid Layouts**: Layout yang dapat beradaptasi dengan mulus ke berbagai ukuran layar.

## Teknik dan Tools

### Tailwind CSS

RuangIn menggunakan Tailwind CSS sebagai framework utama untuk CSS. Tailwind menyediakan utilities yang powerful untuk mempercepat pengembangan responsive design:

1. **Responsive Breakpoints**: Menggunakan prefix seperti `sm:`, `md:`, `lg:`, dan `xl:` untuk menerapkan styling pada breakpoint tertentu.

   ```jsx
   <div className="w-full md:w-1/2 lg:w-1/3">
     {/* Konten */}
   </div>
   ```

2. **Customizable Breakpoints**: Breakpoint disesuaikan dalam konfigurasi Tailwind untuk kebutuhan spesifik aplikasi.

   ```js
   // tailwind.config.js 
   theme: {
     screens: {
       'sm': '640px',
       'md': '768px',
       'lg': '1024px',
       'xl': '1280px',
       '2xl': '1536px',
     }
   }
   ```

### Custom Hooks

RuangIn menggunakan custom hooks untuk logika responsi yang kompleks:

#### useResponsive Hook

```jsx
// hooks/useResponsive.js
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
  };
};
```

Hook ini memberikan informasi tentang jenis perangkat dan digunakan untuk mengontrol logika kompleks dalam komponen yang tidak dapat diselesaikan dengan CSS saja.

#### Optimized Hook dengan Throttling

Untuk performa yang lebih baik, aplikasi juga menggunakan versi yang dioptimalkan dari hook responsive:

```jsx
// hooks/useResponsive.js
export const useResponsiveOptimized = (delay = 250) => {
  const [state, setState] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: undefined
  });

  useEffect(() => {
    let timeoutId = null;

    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        setState({
          isMobile: width < breakpoints.mobile,
          isTablet: width >= breakpoints.mobile && width < breakpoints.desktop,
          isDesktop: width >= breakpoints.desktop,
          width
        });
      }, delay);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [delay]);

  return state;
};
```

## Responsive Layout Patterns

RuangIn menggunakan beberapa layout pattern yang diimplementasikan secara konsisten di seluruh aplikasi:

### 1. Stacked Layout pada Mobile

Layout ini mengubah konten yang berdampingan pada desktop menjadi tumpukan vertikal pada perangkat mobile:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Konten Card */}
</div>
```

### 2. Column Drop

Pattern ini mengubah multi-column layout menjadi single column pada layar yang lebih kecil:

```jsx
<div className="flex flex-col lg:flex-row gap-8">
  <div className="w-full lg:w-1/3">
    {/* Sidebar */}
  </div>
  <div className="w-full lg:w-2/3">
    {/* Main Content */}
  </div>
</div>
```

### 3. Off-Canvas Navigation

Sidebar pada admin panel disembunyikan off-canvas pada perangkat mobile dan dapat diakses melalui toggle:

```jsx
<aside className={`
  fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg
  transform transition-transform duration-300 ease-in-out
  ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  lg:translate-x-0
`}>
  {/* Sidebar content */}
</aside>
```

### 4. Responsive Table → Card View

Tables diubah menjadi card view pada mobile untuk memperbaiki pengalaman pengguna:

```jsx
{/* Mobile View */}
<div className="lg:hidden space-y-2">
  {data.map((row, rowIndex) => (
    <MobileCardView
      key={rowIndex}
      row={row}
      rowIndex={rowIndex}
    />
  ))}
</div>

{/* Desktop View */}
<div className="hidden lg:block">
  <table className="min-w-full">
    {/* Table content */}
  </table>
</div>
```

## Component-Specific Responsive Strategies

### Navbar dan Navigation

Navbar menggunakan strategi khusus untuk transisi antara desktop dan mobile:

```jsx
// Mobile Menu Button (hanya terlihat pada mobile)
<button
  onClick={toggleMenu}
  className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600"
>
  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
</button>

// Mobile Menu (full-screen overlay pada mobile)
<MobileNav isOpen={isOpen} navItems={navItems} />

// Desktop Menu (horizontal navigation)
<DesktopNav
  navItems={navItems}
  isScrolled={isScrolled}
  className="hidden md:flex"
/>
```

### Modal dan Dialog

Modal dirancang untuk responsif pada berbagai ukuran layar:

```jsx
<Dialog.Panel className={`
  w-full max-w-md transform rounded-lg bg-white p-4 sm:p-6 
  text-left align-middle shadow-xl transition-all mx-4 sm:mx-auto
`}>
  {/* Dialog content */}
</Dialog.Panel>
```

### Form Layout

Form layout disesuaikan berdasarkan ukuran layar:

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <Input label="Nama" name="nama" />
  <Input label="Email" name="email" type="email" />
  
  {/* Full width pada semua ukuran layar */}
  <div className="col-span-1 sm:col-span-2">
    <Input label="Subjek" name="subjek" />
  </div>
</div>
```

## Responsive Images

RuangIn menerapkan praktik terbaik untuk gambar responsif:

```jsx
<div className="relative h-64 overflow-hidden">
  <img
    src={imageUrl}
    alt={description}
    className="w-full h-full object-cover"
  />
</div>
```

Pendekatan ini memastikan:
- Gambar mengisi container secara proporsional
- Tidak ada distorsi rasio aspek
- Performa yang baik pada berbagai perangkat

## Media Queries dan Conditional Rendering

### CSS-based Media Queries

Selain prefix Tailwind, aplikasi juga menggunakan CSS media queries untuk kasus yang lebih kompleks:

```css
/* Contoh CSS */
@media (max-width: 640px) {
  .special-element {
    /* Mobile-specific styles */
  }
}
```

### Conditional Rendering berdasarkan Ukuran Layar

Untuk kasus di mana perbedaan UI sangat signifikan, aplikasi menggunakan conditional rendering:

```jsx
const { isMobile } = useResponsive();

return (
  <div>
    {isMobile ? (
      <MobileComponent />
    ) : (
      <DesktopComponent />
    )}
  </div>
);
```

## Optimasi Performa untuk Perangkat Mobile

### 1. Lazy Loading untuk Komponen Berat

```jsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// Dalam render
<Suspense fallback={<LoadingSpinner />}>
  <HeavyComponent />
</Suspense>
```

### 2. Optimasi Gambar

- Penggunaan format gambar yang optimal (WebP)
- Penggunaan teknik lazy loading untuk gambar

### 3. Resource Prioritization

Asset kritikal dimuat terlebih dahulu, sementara yang lain dimuat secara lazy:

```jsx
// Prioritas tinggi - dalam <head>
<link rel="preload" href="/assets/critical.css" as="style" />

// Prioritas rendah - load asynchronously
<link rel="stylesheet" href="/assets/non-critical.css" media="print" onload="this.media='all'" />
```

## Responsive Typography

RuangIn menggunakan sistem tipografi responsif untuk memastikan keterbacaan pada semua ukuran layar:

```jsx
// Heading
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Judul Halaman
</h1>

// Body text
<p className="text-sm md:text-base">
  Konten paragraf
</p>
```

## Testing Responsif

RuangIn menggunakan beberapa metode untuk memastikan fungsionalitas responsif:

1. **Manual Testing**: Pengujian pada berbagai perangkat fisik
2. **Browser Dev Tools**: Menggunakan mode responsif pada browser
3. **Visual Regression Testing**: Membandingkan screenshot UI pada berbagai ukuran layar

## Implementasi Responsif pada Modul Utama

### 1. Dashboard Admin

Dashboard admin menggunakan pendekatan responsif berikut:
- Grid layout yang beralih dari 1 kolom (mobile) ke 4 kolom (desktop)
- Chart yang menyesuaikan dengan lebar kontainer
- Tabel yang berubah menjadi card view pada mobile

### 2. Halaman Jadwal

Halaman jadwal menerapkan strategi:
- Kalender full-width pada mobile
- Side-by-side calendar dan detail pada desktop
- Filter yang berubah dari dropdown (mobile) menjadi horizontal (desktop)

### 3. Formulir Peminjaman

Formulir peminjaman menggunakan:
- Stacked form controls pada mobile
- Multi-column layout pada desktop
- Date picker yang menyesuaikan layar

## Best Practices

RuangIn mengikuti praktik terbaik berikut untuk responsive design:

1. **Selalu uji pada perangkat sebenarnya**, bukan hanya emulator browser
2. **Gunakan relative units** (rem, em, %) daripada pixel absolut
3. **Desain untuk touch interactions** pada perangkat mobile
4. **Optimasi performa** dengan memuat hanya resource yang diperlukan
5. **Konsistensi pada breakpoints** - gunakan nilai yang sama di seluruh aplikasi
6. **Pertimbangkan accessibility** pada semua ukuran layar
7. **Test edge cases** seperti form field dengan input yang sangat panjang

## Challenges dan Solusi

### Challenge 1: Tabel Kompleks

**Problem**: Tabel dengan banyak kolom sulit ditampilkan pada perangkat mobile.

**Solusi**: Transformasi tabel menjadi card view dengan informasi yang tersusun secara vertikal, dan hanya menampilkan informasi paling penting by default dengan opsi expand untuk detailnya.

### Challenge 2: Forms yang Panjang

**Problem**: Form dengan banyak field tidak nyaman pada mobile.

**Solusi**: 
- Form dibagi menjadi beberapa langkah/section
- Penggunaan multi-column hanya pada desktop
- Prioritas field yang paling penting

### Challenge 3: Navigasi yang Kompleks

**Problem**: Struktur navigasi yang dalam dan luas sulit diakses pada mobile.

**Solusi**: 
- Hamburger menu dengan hierarchical navigation
- Context-sensitive navigation
- Breadcrumbs pada halaman tertentu

## Struktur dan Organisasi Kode

RuangIn mengelola kode responsif dengan pendekatan berikut:

1. **Component-based design** - responsivitas dienkapsulasi dalam komponen
2. **Reusable hooks** untuk logika responsive
3. **Utility functions** untuk kalkulasi terkait ukuran
4. **Consistent pattern libraries** untuk memastikan konsistensi

