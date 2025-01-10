import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import dayjs from 'dayjs';

export const BookingDialog = ({ isOpen, onClose, bookings, date }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-2">
        <Dialog.Panel className="mx-auto w-96  rounded-lg bg-white p-4  shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Peminjaman 
            </Dialog.Title>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 ">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{booking.nama_kegiatan}</h3>
                    <p className="text-sm text-gray-500">
                      {booking.jam_mulai} - {booking.jam_selesai}
                    </p>
                  </div>
                  <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${booking.status === 'DISETUJUI' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  `}>
                    {booking.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Peminjam: {booking.Pengguna.nama_lengkap}
                </p>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-center text-gray-500">
                Tidak ada peminjaman pada tanggal ini
              </p>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};