// src/components/dialog/BookingDialog.jsx
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import api from '@/utils/api';
import dayjs from 'dayjs';

export default function BookingRoomDialog({ isOpen, onClose, roomId, roomName }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nama_kegiatan: '',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: '',
    no_surat_peminjaman: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/v1/peminjaman', {
        ruang_rapat_id: roomId,
        ...formData
      });
      
      onClose();
      // Optional: Add success notification or callback
    } catch (error) {
      setError(error.response?.data?.message || 'Terjadi kesalahan saat mengajukan peminjaman');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get min date (today) and max date (1 year from now)
  const minDate = dayjs().format('YYYY-MM-DD');
  const maxDate = dayjs().add(1, 'year').format('YYYY-MM-DD');

  return (
    <Dialog 
      open={isOpen} 
      onClose={() => !loading && onClose()}
      className="relative z-50"
    >
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

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Jam Mulai"
                type="time"
                name="jam_mulai"
                value={formData.jam_mulai}
                onChange={handleInputChange}
                required
                fullWidth
              />

              <Input
                label="Jam Selesai"
                type="time"
                name="jam_selesai"
                value={formData.jam_selesai}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </div>

            <Input
              label="Nomor Surat Peminjaman"
              name="no_surat_peminjaman"
              value={formData.no_surat_peminjaman}
              onChange={handleInputChange}
              required
              fullWidth
              placeholder="Masukkan nomor surat"
            />

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

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