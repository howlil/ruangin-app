import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/utils/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import RoomCard from './RoomCard';
import BookingRoomHome from './BookingRoomHome';
import { HandleResponse } from '@/components/ui/HandleResponse';


const CheckRoomModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    tanggal: '',
    jam: ''
  });
  const [loading, setLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

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
      HandleResponse({ response })

      setAvailableRooms(response.data.data.ruangan_tersedia);
      if (response.data.data.ruangan_tersedia.length === 0) {
        HandleResponse({ errorMessage: "Tidak ada ruangan yang tersedia pada waktu tersebut" })
      }
    } catch (error) {
      HandleResponse({
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      tanggal: '',
      jam: ''
    });
    setAvailableRooms([]);
    setError('');
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => {
          onClose();
          resetForm();
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-xl rounded-lg bg-white shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <Dialog.Title className="text-lg font-semibold">
                Cek Ketersediaan Ruang Rapat
              </Dialog.Title>
              <button
                onClick={() => {
                  onClose();
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <form onSubmit={handleSubmit} className="mb-4">
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
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
                  className='w-full'
                >
                  Cek Ketersediaan
                </Button>
              </form>

              {availableRooms.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">
                      Ruangan Tersedia
                    </h3>
                    <span className="text-sm text-gray-500">
                      {availableRooms.length} ruangan
                    </span>
                  </div>
                  <div className="space-y-3 grid max-h-[300px] overflow-y-auto no-scrollbar">
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
          </Dialog.Panel>
        </div>
      </Dialog>

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
    </>
  );
};

export default CheckRoomModal;