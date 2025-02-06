import React from 'react';
import { Dialog } from '@headlessui/react';
import { Calendar, Clock, MapPin, X, User, Building } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

const IconWrapper = ({ children }) => (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50">
        {children}
    </div>
);

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-4">
        <IconWrapper>{icon}</IconWrapper>
        <div className="flex flex-col">
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-sm text-gray-700">{value}</span>
        </div>
    </div>
);

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
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white shadow-xl transition-all">
                    {/* Header */}
                    <div className="relative p-6 pb-4 border-b border-gray-100">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-50 transition-colors"
                            aria-label="Close dialog"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <Dialog.Title className="text-xl font-semibold text-gray-900 pr-8">
                            {booking.nama_kegiatan}
                        </Dialog.Title>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                                {booking.no_surat_peminjaman}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Booking Details */}
                        <div className="space-y-4">
                            <InfoRow
                                icon={<Calendar className="w-4 h-4 text-blue-600" />}
                                label="Tanggal"
                                value={`${formatDate(booking.tanggal_mulai)}${booking.tanggal_selesai ? ` - ${formatDate(booking.tanggal_selesai)}` : ''
                                    }`}
                            />

                            <InfoRow
                                icon={<Clock className="w-4 h-4 text-blue-600" />}
                                label="Waktu"
                                value={`${booking.jam_mulai} - ${booking.jam_selesai}`}
                            />

                            <InfoRow
                                icon={<MapPin className="w-4 h-4 text-blue-600" />}
                                label="Lokasi"
                                value={booking.room?.nama_ruangan}
                            />
                        </div>

                        {/* User Details */}
                        <div className="pt-4 border-t border-gray-100">
                            <div className="space-y-4">
                                <InfoRow
                                    icon={<User className="w-4 h-4 text-blue-600" />}
                                    label="Peminjam"
                                    value={booking.Pengguna?.nama_lengkap}
                                />

                                <InfoRow
                                    icon={<Building className="w-4 h-4 text-blue-600" />}
                                    label="Tim Kerja"
                                    value={`${booking.Pengguna?.DetailPengguna.tim_kerja.nama_tim_kerja} (${booking.Pengguna?.DetailPengguna.tim_kerja.code})`}
                                />
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default BookingDetailModal;