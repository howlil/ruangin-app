import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import api from '@/utils/api';
import dayjs from 'dayjs';
import { HandleResponse } from '@/components/ui/HandleResponse';
import { Toaster } from 'react-hot-toast';

export default function BookingRoomDialog({ isOpen, onClose, roomId, roomName }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_kegiatan: '',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: '',
    no_surat_peminjaman: ''
  });
  const [timeError, setTimeError] = useState('');

  const validateTimeRange = (start, end) => {
    if (!start || !end) return true;

    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    const startMinute = parseInt(start.split(':')[1]);
    const endMinute = parseInt(end.split(':')[1]);

    // Convert to minutes for easier comparison
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    if (startHour < 7 || endHour > 17 || (endHour === 17 && endMinute > 0)) {
      setTimeError('Waktu peminjaman harus antara jam 07:00 - 17:00');
      return false;
    }

    if (endTotalMinutes <= startTotalMinutes) {
      setTimeError('Jam selesai harus lebih besar dari jam mulai');
      return false;
    }

    setTimeError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateTimeRange(formData.jam_mulai, formData.jam_selesai)) {
      return;
    }

    setLoading(true);

    try {
      await api.post('/v1/peminjaman', {
        ruang_rapat_id: roomId,
        ...formData
      });

      onClose();
    } catch (error) {
      HandleResponse({
        error: error,
        errorMessage: 'Terjadi kesalahan saat mengajukan peminjaman'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      if (name === 'jam_mulai' || name === 'jam_selesai') {
        validateTimeRange(newData.jam_mulai, newData.jam_selesai);
      }
      
      return newData;
    });
  };

  const minDate = dayjs().format('YYYY-MM-DD');
  const maxDate = dayjs().add(1, 'year').format('YYYY-MM-DD');

  return (
    <Dialog
      open={isOpen}
      onClose={() => !loading && onClose()}
      className="relative z-50"
    >
      <Toaster />
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Dialog.Title className="text-xl font-semibold">
                Ajukan Peminjaman Ruangan
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mt-1">
                {roomName}
              </Dialog.Description>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Kegiatan"
              name="nama_kegiatan"
              value={formData.nama_kegiatan}
              onChange={handleInputChange}
              required
              fullWidth
              placeholder="Masukkan nama kegiatan"
            />

            <Input
              label="Tanggal"
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleInputChange}
              min={minDate}
              max={maxDate}
              required
              fullWidth
            />

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Jam Mulai"
                  type="time"
                  name="jam_mulai"
                  value={formData.jam_mulai}
                  onChange={handleInputChange}
               
                  required
                  fullWidth
                  helperText="Format 24 jam (07:00 - 17:00)"
                />

                <Input
                  label="Jam Selesai"
                  type="time"
                  name="jam_selesai"a
                  value={formData.jam_selesai}
                  onChange={handleInputChange}
               
                  required
                  fullWidth
                  helperText="Format 24 jam (07:00 - 17:00)"
                />
              </div>
              {timeError && (
                <p className="text-sm text-red-500 mt-1">{timeError}</p>
              )}
            </div>

            <Input
              label="Nomor Surat Undangan"
              name="no_surat_peminjaman"
              value={formData.no_surat_peminjaman}
              onChange={handleInputChange}
              required
              fullWidth
              placeholder="Masukkan nomor surat"
            />

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading || !!timeError}
              >
                Ajukan Peminjaman
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}