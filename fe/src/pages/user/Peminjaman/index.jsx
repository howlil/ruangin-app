// src/pages/Peminjaman.jsx
import React, { useState, useEffect } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/utils/api";
import dayjs from 'dayjs';
import Button from '@/components/ui/Button';
import BookingCalendar from './BookingCalendar';
import { BookingDialog } from './BookingDialog';
import BookingRoomDialog from './BookingRoomDialog';
import { HandleResponse } from '@/components/ui/HandleResponse';
import { getUser } from '@/utils/auth';
import { showToast } from '@/components/ui/Toast';


export default function Peminjaman() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const user = getUser()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await api.get(`/v1/ruang-rapat/${id}`);
        setRoom(response.data.data);
        console.log(response.data)
      } catch (error) {
        HandleResponse({
          error,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [id]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsCalendarDialogOpen(true);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="px-4 sm:px-6 lg:px-20 pb-20 pt-24">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Room Details */}
          <div>
            <h1 className="text-2xl font-bold mb-4">{room.nama_ruangan}</h1>
            <p className="text-gray-600 mb-6">{room.deskripsi}</p>

            <div className="mb-8">
              <img
                src={`${import.meta.env.VITE_API_URL}${room.foto_ruangan}`}
                alt={room.nama_ruangan}
                className="w-full h-[300px] object-cover rounded-lg"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg text-center">
              <div>
                <p className="text-sm text-gray-500">Gedung</p>
                <p className="font-medium">{room.lokasi_ruangan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lantai</p>
                <p className="font-medium">Lantai 16 </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kapasitas</p>
                <p className="font-medium">{room.kapasitas} Orang</p>
              </div>
            </div>
          </div>

          {/* Right Side - Calendar */}
          <div className="space-y-6">
            <BookingCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              bookings={room?.peminjaman}
            />

            <Button
              className="w-full"
              onClick={() => {
                if (!user) {
                  showToast("Tolong login terlebih dahulu sebelum melakukan peminjaman", "error");
                  setTimeout(() => {
                    navigate("/login");
                  }, 1000);
                } else {
                  setIsBookingDialogOpen(true)
                }

              }}
            >
              Ajukan Peminjaman
            </Button>
          </div>
        </div>

        {/* Calendar Dialog */}
        <BookingDialog
          isOpen={isCalendarDialogOpen}
          onClose={() => setIsCalendarDialogOpen(false)}
          bookings={room.peminjaman}
          date={selectedDate}
        />

        {/* Booking Dialog */}
        <BookingRoomDialog
          isOpen={isBookingDialogOpen}
          onClose={() => setIsBookingDialogOpen(false)}
          roomId={room.id}
          roomName={room.nama_ruangan}
        />
      </div>
    </MainLayout>
  );
}