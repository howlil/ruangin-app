`use client`
import MainLayout from "@/components/layout/MainLayout"
import api from "@/utils/api"
import React from "react"
import RoomCard from "@/components/ui/RoomCard"
import CheckRoomModal from "./CheckRoomModal"
import { HandleResponse } from "@/components/ui/HandleResponse"
import RoomScheduleList from "./RoomScheduleList"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { cn } from "@/utils/utils"

export default function Beranda() {
  const [rooms, setRooms] = React.useState([]);
  const [todays, setToday] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [roomsResponse, todaysResponse] = await Promise.all([
          api.get('/v1/ruang-rapat'),
          api.get('/v1/display')
        ]);

        setRooms(roomsResponse.data.data);
        setToday(todaysResponse.data.data);
      } catch (error) {
        HandleResponse({ error });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (

    <MainLayout>

      <AnimatedGridPattern
        numSquares={60}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%]",
        )}
      />
      <div className="relative overflow-hidden min-h-screen">


        {/* Gradient backgrounds */}
        <div className="absolute -top-20 -left-10 w-72 h-72 bg-blue-100  rounded-full filter blur-[10rem]"></div>
        <div className="absolute -bottom-72 -right-[30rem] w-[800px] h-[800px] bg-blue-300   bg-opacity-35 rounded-full filter blur-[10rem] -z-10"></div>

        {/* Hero section with schedule */}
        <section className="max-w-7xl md:mt-16 mx-auto px-4 sm:px-6 lg:px-20 py-16 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8 relative z-10">
              <h1 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-500/80 bg-clip-text  text-5xl font-bold leading-none text-transparent dark:from-gray-500 dark:to-slate-900/10">
                Kelola Rapat Anda dengan Mudah dan Efisien
              </h1>
              <CheckRoomModal />
            </div>

            <div className="relative lg:block z-10">
              {loading ? (
                <div className="flex justify-center items-center min-h-[500px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <RoomScheduleList schedules={todays} />
              )}
            </div>
          </div>
        </section>

        {/* Available rooms section */}
        <section id="ruangan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-16 relative">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-semibold text-gray-900">
              Ruangan Tersedia
            </h2>
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

  );
}