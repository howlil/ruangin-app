import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, FileText, User, Copy, CheckCheck, Upload } from 'lucide-react';
import Button from '@/components/ui/Button';

const BookingCard = ({ 
  booking, 
  onExportAbsensi, 
  exportLoading 
}) => {
  const [copiedId, setCopiedId] = useState(null);

  const formatDateRange = (startDate, endDate) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const start = new Date(startDate).toLocaleDateString('id-ID', options);
    if (!endDate) return start;
    const end = new Date(endDate).toLocaleDateString('id-ID', options);
    return `${start} - ${end}`;
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:border-gray-200 hover:shadow-sm">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="w-full md:w-1/4 h-48 md:h-auto">
          <div className="relative h-full">
            <img
              src={`${import.meta.env.VITE_API_URL}${booking.RuangRapat.foto_ruangan}`}
              alt={booking.RuangRapat.nama_ruangan}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full md:w-2/4 p-4 border-b md:border-b-0 md:border-r border-gray-100">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {booking.RuangRapat.nama_ruangan}
              </h3>
              <p className="text-blue-600 text-sm font-medium">
                {booking.nama_kegiatan}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm break-words">
                  {formatDateRange(booking.tanggal_mulai, booking.tanggal_selesai)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm">
                  {booking.jam_mulai} - {booking.jam_selesai} WIB
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm">
                  {booking.RuangRapat.lokasi_ruangan}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm">
                  Kapasitas: {booking.RuangRapat.kapasitas} orang
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm">
                  No. Surat: {booking.no_surat_peminjaman}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm">
                  {booking.Pengguna.nama_lengkap}
                </span>
              </div>
            </div>

            {/* Rejection Message */}
            {booking.alasan_penolakan && (
              <div className="mt-4 p-2 rounded bg-rose-50 border border-rose-100">
                <p className="text-sm text-rose-600">
                  {booking.alasan_penolakan}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions Section */}
        <div className="w-full md:w-1/4 p-4 flex flex-col justify-center items-center bg-gray-50">
          {booking.status === 'DISETUJUI' && booking.Absensi?.link_absensi ? (
            <div className="w-full space-y-4">
              <div className="text-center">
                <span className="text-sm text-gray-600 font-medium">
                  Link Absensi
                </span>
                <button
                  onClick={() => copyToClipboard(booking.Absensi.link_absensi, booking.id)}
                  className={`
                    mt-2 w-full inline-flex items-center justify-center gap-2 px-4 py-2 
                    rounded-lg text-sm font-medium transition-colors
                    ${copiedId === booking.id
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}
                  `}
                >
                  {copiedId === booking.id ? (
                    <>
                      <CheckCheck className="w-4 h-4" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
              </div>
              
              <Button
                onClick={() => onExportAbsensi(booking.Absensi?.link_absensi)}
                icon={Upload}
                disabled={exportLoading || !booking.Absensi?.link_absensi}
                className="w-full justify-center"
              >
                {exportLoading ? 'Mengexport...' : 'Export Data'}
              </Button>
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center">
              Tidak ada aksi yang tersedia
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;