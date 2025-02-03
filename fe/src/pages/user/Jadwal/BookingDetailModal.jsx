// src/features/room-booking/components/BookingDetail/BookingDetailModal.jsx
import { Dialog } from '@headlessui/react';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export const BookingDetailModal = ({ open, booking, onClose }) => {
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
        <Dialog
            open={open}
            onClose={onClose}
            className="relative z-50"
        >
            {/* Background overlay */}
            <div className="fixed inset-0 bg-black/30 transition-opacity" aria-hidden="true" />

            {/* Dialog position */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                    <div className="mb-4 flex justify-between items-center">
                        <div>
                            <Dialog.Title className="text-lg font-semibold">
                                {booking.nama_kegiatan}
                            </Dialog.Title>
                            <p className="text-sm text-gray-600">{booking.room?.nama_ruangan}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors"
                            aria-label="Close dialog"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar className="w-4 h-4 shrink-0" />
                                    <span>
                                        {formatDate(booking.tanggal_mulai)}
                                        {booking.tanggal_selesai && (
                                            ` - ${formatDate(booking.tanggal_selesai)}`
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-gray-600">
                                    <Clock className="w-4 h-4 shrink-0" />
                                    <span>{booking.jam_mulai} - {booking.jam_selesai}</span>
                                </div>

                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-4 h-4 shrink-0" />
                                    <span className="break-words">{booking.room?.lokasi_ruangan}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-sm space-y-1">
                            <Dialog.Description as="div" className="text-gray-600">
                                <p className="font-medium">{booking.Pengguna?.nama_lengkap}</p>
                                <p>{booking.Pengguna?.email}</p>
                            </Dialog.Description>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default BookingDetailModal;