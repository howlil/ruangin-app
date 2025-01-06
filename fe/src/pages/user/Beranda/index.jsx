import MainLayout from "@/components/layout/MainLayout"
import Button from "@/components/ui/Button"
import imghero from "@/assets/ilustration/heroimg.png"
import GridBackground from "@/components/ui/GridBackground"

export default function Beranda() {
  return (
    <MainLayout>
      <div className=" relative overflow-hidden">
        <GridBackground />
        <div className="absolute -top-20 -left-10 w-72 h-72 bg-primary bg-opacity-35 rounded-full filter blur-[10rem]"></div>
        <div className="absolute -bottom-72 -right-[30rem] w-[800px] h-[800px] bg-primary bg-opacity-35 rounded-full filter blur-[10rem] -z-10"></div>

        <section className="max-w-7xl px-4 sm:px-6 lg:px-20 py-16  relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 relative z-10">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Kelola Rapat Anda dengan Mudah dan Efisien
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Cek ketersediaan, ajukan peminjaman, dan kelola jadwal rapat dalam satu platform digital terintegrasi. Optimalkan fasilitas rapat untuk produktivitas lebih baik.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                >
                  Mulai Reservasi
                </Button>
                <Button
                  color="blue"
                  variant="secondary"
                >
                  Cek Ketersediaan
                </Button>
              </div>
            </div>

            {/* Right Content - Original Illustration */}
            <div className="relative lg:block z-10">
              <div className="w-full max-w-2xl ">
                <img
                  src={imghero}
                  alt="Meeting Room Management Illustration"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl px-4 sm:px-6 lg:px-20 py-16  relative">
          <h1 className="text-center text-3xl font-semibold">Ruangan
          </h1>
        </section>
      </div>
    </MainLayout>
  )
}