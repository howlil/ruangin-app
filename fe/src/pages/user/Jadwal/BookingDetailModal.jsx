// src/features/room-booking/components/BookingDetail/BookingDetailModal.jsx
import { Dialog } from '@headlessui/react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale'; 

export const BookingDetailModal = ({ booking, onClose }) => {
    if (!booking) return null;

    const formatDate = (date) => {
        try {
            return format(parseISO(date), 'd MMMM yyyy', { locale: id });
        } catch (error) {
            console.error('Error formatting date:', error);
            return date; 
        }
    };

    return (
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">{booking.nama_kegiatan}</h3>
                    <p className="text-sm text-gray-600">{booking.room?.nama_ruangan}</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 text-xl p-2"
                    aria-label="Close modal"
                >
                    ×
                </button>
            </div>

            <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {formatDate(booking.tanggal_mulai)}
                                {booking.tanggal_selesai && (
                                    ` - ${formatDate(booking.tanggal_selesai)}`
                                )}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{booking.jam_mulai} - {booking.jam_selesai}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.room?.lokasi_ruangan}</span>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-gray-600">
                    <p className="font-medium">{booking.Pengguna?.nama_lengkap}</p>
                    <p>{booking.Pengguna?.email}</p>
                </div>
            </div>
        </Dialog.Panel>
    );
};

export default BookingDetailModal;