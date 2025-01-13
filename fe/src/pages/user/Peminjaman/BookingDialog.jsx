// src/components/dialog/BookingDialog.jsx
import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Clock, User, FileText } from 'lucide-react';
import { id } from 'date-fns/locale';
import { format } from 'date-fns';

export function BookingDialog({ isOpen, onClose, bookings = [], date }) {
  const formattedDate = format(date.toDate(), 'EEEE, d MMMM yyyy', { locale: id });
  
  // Filter out rejected bookings
  const filteredBookings = bookings.filter(booking => booking.status !== 'DITOLAK');

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Dialog.Title className="text-xl font-semibold">
                Jadwal Peminjaman
              </Dialog.Title>
              <p className="text-sm text-gray-500 mt-1">
                {formattedDate}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada peminjaman pada tanggal ini</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div 
                  key={booking.id}
                  className="p-4 bg-gray-50 rounded-lg space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{booking.nama_kegiatan}</h3>
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${(() => {
                        switch (booking.status) {
                          case 'DIPROSES': return 'bg-yellow-100 text-yellow-800';
                          case 'DISETUJUI': return 'bg-green-100 text-green-800';
                          case 'SELESAI': return 'bg-gray-100 text-gray-800';
                          default: return 'bg-gray-100 text-gray-800';
                        }
                      })()}
                    `}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{booking.jam_mulai} - {booking.jam_selesai}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{booking.Pengguna?.nama_lengkap}</span>
                    </div>
                  </div>

                  {booking.no_surat_peminjaman && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>No. Surat: {booking.no_surat_peminjaman}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}