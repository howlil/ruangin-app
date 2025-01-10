import MainLayout from "@/components/layout/MainLayout"
import Button from "@/components/ui/Button"
import imghero from "@/assets/ilustration/heroimg.png"
import GridBackground from "@/components/ui/GridBackground"
import api from "@/utils/api"
import React from "react"
import RoomCard from "@/components/ui/RoomCard"

export default function Beranda() {
  const [rooms, setRooms] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const scrollToRuangan = () => {
    window.scrollTo({
      top: document.getElementById('ruangan').offsetTop - 64, 
      behavior: 'smooth'
    });
  };

  React.useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get('/v1/ruang-rapat');
        setRooms(response.data.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <MainLayout>
      <div className="relative overflow-hidden">
        <GridBackground />
        <div className="absolute -top-20 -left-10 w-72 h-72 bg-primary bg-opacity-35 rounded-full filter blur-[10rem]"></div>
        <div className="absolute -bottom-72 -right-[30rem] w-[800px] h-[800px] bg-primary bg-opacity-35 rounded-full filter blur-[10rem] -z-10"></div>

        <section className="max-w-7xl px-4 sm:px-6 lg:px-20 py-16 relative">
          {/* Rest of your hero section code remains the same */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 relative z-10">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Kelola Rapat Anda dengan Mudah dan Efisien
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Cek ketersediaan, ajukan peminjaman, dan kelola jadwal rapat dalam satu platform digital terintegrasi. Optimalkan fasilitas rapat untuk produktivitas lebih baik.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={scrollToRuangan}>
                  Mulai Reservasi
                </Button>
                <Button
                  color="blue"
                  variant="secondary"
                  onClick={scrollToRuangan}
                >
                  Cek Ketersediaan
                </Button>
              </div>
            </div>

            <div className="relative lg:block z-10">
              <div className="w-full max-w-2xl">
                <img
                  src={imghero}
                  alt="Meeting Room Management Illustration"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Rooms section */}
        <section id="ruangan" className="max-w-7xl px-4 sm:px-6 lg:px-20 py-16 relative">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-semibold text-gray-900">Ruangan Tersedia</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pilih ruangan yang sesuai dengan kebutuhan Anda. Setiap ruangan dilengkapi dengan fasilitas modern untuk menunjang aktivitas rapat.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}

          {!loading && rooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Tidak ada ruangan tersedia saat ini.</p>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  )
}