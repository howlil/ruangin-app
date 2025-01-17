// src/pages/Riwayat/components/EditBookingModal.jsx
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import api from "@/utils/api";
import { format } from 'date-fns';

function EditBookingModal({ isOpen, booking, rooms = [], onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama_kegiatan: '',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: '',
    no_surat_peminjaman: '',
    ruang_rapat_id: ''
  });

  useEffect(() => {
    if (booking) {
      setFormData({
        nama_kegiatan: booking.nama_kegiatan || '',
        tanggal: booking.tanggal || '',
        jam_mulai: booking.jam_mulai || '',
        jam_selesai: booking.jam_selesai || '',
        no_surat_peminjaman: booking.no_surat_peminjaman || '',
        ruang_rapat_id: booking.ruang_rapat_id || ''
      });
    }
  }, [booking]);

  const validateTime = (timeStr) => {
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timePattern.test(timeStr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate time format
    if (!validateTime(formData.jam_mulai) || !validateTime(formData.jam_selesai)) {
      return;
    }

    // Validate time range
    const start = new Date(`2000-01-01 ${formData.jam_mulai}`);
    const end = new Date(`2000-01-01 ${formData.jam_selesai}`);
    
    if (end <= start) {
      return;
    }

    // Validate date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.tanggal);
    if (selectedDate < today) {
      return;
    }

    try {
      setIsLoading(true);
      await api.patch(`/v1/peminjaman/${booking.id}/status`, formData);
      onSuccess();
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Edit Peminjaman
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ruangan <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.ruang_rapat_id}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  ruang_rapat_id: e.target.value 
                }))}
                required
                className="w-full"
              >
                <option value="">Pilih Ruangan</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.nama_ruangan} - {room.lokasi_ruangan} (Kapasitas: {room.kapasitas})
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama Kegiatan <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.nama_kegiatan}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  nama_kegiatan: e.target.value 
                }))}
                required
                placeholder="Masukkan nama kegiatan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  tanggal: e.target.value 
                }))}
                required
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Jam Mulai <span className="text-red-500">*</span>
                </label>
                <Input
                  type="time"
                  value={formData.jam_mulai}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    jam_mulai: e.target.value 
                  }))}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Format: HH:mm</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Jam Selesai <span className="text-red-500">*</span>
                </label>
                <Input
                  type="time"
                  value={formData.jam_selesai}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    jam_selesai: e.target.value 
                  }))}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Format: HH:mm</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                No. Surat Undangan
              </label>
              <Input
                value={formData.no_surat_peminjaman}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  no_surat_peminjaman: e.target.value 
                }))}
                placeholder="Masukkan nomor surat"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                loading={isLoading}
              >
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default EditBookingModal;