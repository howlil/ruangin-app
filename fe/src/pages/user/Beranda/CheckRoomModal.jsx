import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/utils/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import RoomCard from './RoomCard';
import BookingRoomHome from './BookingRoomHome';
import { HandleResponse } from '@/components/ui/HandleResponse';
import { getUser } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/components/ui/Toast';

const CheckRoomModal = () => {
  const [formData, setFormData] = useState({
    tanggal: '',
    jam: ''
  });
  const [loading, setLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const user = getUser()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setAvailableRooms([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/v1/check', {
        tanggal: formData.tanggal,
        jam: formData.jam
      });

      setAvailableRooms(response.data.data.ruangan_tersedia);
      if (response.data.data.ruangan_tersedia.length === 0) {
        showToast(
          "Tidak ada ruangan yang tersedia pada waktu tersebut", "error"
        );
      } else {
        HandleResponse({ response });

      }
    } catch (error) {
      HandleResponse({ error });
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (room) => {
    if (!user) {
      showToast("Silahkan login dulu sebelum melakukan peminjaman", "error")
      navigate("/login")
    } else {
      setSelectedRoom(room);
      setIsBookingModalOpen(true);
    }

  };

  const resetForm = () => {
    setFormData({
      tanggal: '',
      jam: ''
    });
    setAvailableRooms([]);
  };

  return (
    <div className="w-full max-w-xl mx-auto  backdrop-blur-md border border-white shadow-xl shadow-gray-400/10 rounded-lg ">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">
          Cek Ketersediaan Ruang Rapat
        </h2>

      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input
              label="Tanggal"
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleInputChange}
              required
              fullWidth
              startIcon={<Calendar className="w-4 h-4" />}
              min={format(new Date(), 'yyyy-MM-dd')}
            />

            <Input
              label="Waktu"
              type="time"
              name="jam"
              fullWidth
              value={formData.jam}
              onChange={handleInputChange}
              required
              startIcon={<Clock className="w-4 h-4" />}
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="w-full"
          >
            Cek Ketersediaan
          </Button>
        </form>

        {availableRooms.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">
                Ruangan Tersedia
              </h3>
              <span className="text-sm text-gray-500">
                {availableRooms.length} ruangan
              </span>
            </div>
            <div className="space-y-3 max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {availableRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onBookClick={handleRoomClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedRoom && (
        <BookingRoomHome
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedRoom(null);
          }}
          roomId={selectedRoom.id}
          roomName={selectedRoom.nama_ruangan}
          selectedDate={formData.tanggal}
          selectedTime={formData.jam}
        />
      )}
    </div>
  );
};

export default CheckRoomModal;