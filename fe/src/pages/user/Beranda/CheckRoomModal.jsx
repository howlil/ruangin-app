// src/components/modal/CheckRoomModal.jsx
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/utils/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

const CheckRoomModal = ({ isOpen, onClose, rooms = [] }) => {
  const [formData, setFormData] = useState({
    tanggal: '',
    jam: '',
    ruang_rapat_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.post('/v1/check', {
        tanggal: formData.tanggal,
        jam: formData.jam,
        ruang_rapat_id: formData.ruang_rapat_id
      });

      setResult(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Terjadi kesalahan saat mengecek ketersediaan');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      tanggal: '',
      jam: '',
      ruang_rapat_id: ''
    });
    setResult(null);
    setError('');
  };

  return (
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
        <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-4 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">
              Cek Ruang Rapat
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

          <form onSubmit={handleSubmit} >
            <section className='md:flex  mb-4 gap-2'>
              <Input
                label="Tanggal"
                className="w-full"
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleInputChange}
                required
                startIcon={<Calendar className="w-4 h-4" />}
                min={format(new Date(), 'yyyy-MM-dd')}
              />

              <Input
                label="Waktu"
                type="time"
                name="jam"
                className="w-full"
                value={formData.jam}
                onChange={handleInputChange}
                required
                startIcon={<Clock className="w-4 h-4" />}
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Ruangan<span className="text-red-500 ml-1">*</span>
                </label>
                <Select
                  name="ruang_rapat_id"
                  value={formData.ruang_rapat_id}
                  onChange={handleInputChange}
                  className="pl-3"
                  required
                >
                  <option className='text-black' value="">Pilih ruangan</option>
                  {rooms.map((room) => (
                    <option className='text-black' key={room.id} value={room.id}>
                      {room.nama_ruangan}
                    </option>
                  ))}
                </Select>
              </div>

            </section>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {result && (
              <div className={`rounded-md mb-4w p-4 ${result.available
                ? 'bg-green-50 text-green-700'
                : 'bg-yellow-50 text-yellow-700'
                }`}>
                <p className="font-medium">
                  {result.available
                    ? `${result.room_name} tersedia pada waktu yang dipilih`
                    : `${result.room_name} tidak tersedia`}
                </p>
                {result.existing_bookings?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Jadwal terisi:</p>
                    <ul className="mt-1 text-sm space-y-1">
                      {result.existing_bookings.map((booking, index) => (
                        <li key={index}>
                          {booking.start} - {booking.end}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}


            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className='w-full'
            >
              Cek Ketersediaan
            </Button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CheckRoomModal;