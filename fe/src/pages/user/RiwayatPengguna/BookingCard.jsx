import React, { useState } from 'react';
import { Calendar, FileX, Clock, MapPin, Users, FileText, User, Copy, CheckCheck, Upload, List } from 'lucide-react';
import Button from '@/components/ui/Button';
import AttendanceDialog from './AttendanceDialog';

const BookingCard = ({
  booking,
  onExportAbsensiExcel,
  onExportAbsensiPdf,
  onFetchAbsensi,
  exportLoading
}) => {
  const [copiedId, setCopiedId] = useState(null);
  const [showAbsensi, setShowAbsensi] = useState(false);
  const [listAbsensi, setListAbsensi] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleShowAbsensi = async () => {
    setLoading(true);
    try {
      const data = await onFetchAbsensi(booking.Absensi?.link_absensi);
      setListAbsensi(data);
      setShowAbsensi(true);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:border-gray-200 hover:shadow-sm">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="w-full md:w-1/4 h-48 md:h-auto relative">
            <img
              src={`${import.meta.env.VITE_API_URL}${booking.RuangRapat.foto_ruangan}`}
              alt={booking.RuangRapat.nama_ruangan}
              className="h-full w-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white md:hidden">
              <h3 className="text-lg font-semibold">
                {booking.RuangRapat.nama_ruangan}
              </h3>
              <p className="text-sm font-medium text-white/90">
                {booking.nama_kegiatan}
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="w-full md:w-2/4 p-4 border-b md:border-b-0 md:border-r border-gray-100">
            <div className="h-full flex flex-col">
              <div className="mb-4 hidden md:block">
                <h3 className="text-lg font-semibold text-gray-900">
                  {booking.RuangRapat.nama_ruangan}
                </h3>
                <p className="text-blue-600 text-sm font-medium">
                  {booking.nama_kegiatan}
                </p>
              </div>

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
            {booking.status === 'DISETUJUI' || booking.status === 'SELESAI' && booking.Absensi?.link_absensi ? (
              <div className="w-full space-y-3">
                {booking.status === 'DISETUJUI' && (
                  <>
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
                      onClick={handleShowAbsensi}
                      icon={List}
                      disabled={loading}
                      className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {loading ? 'Memuat...' : 'Lihat Daftar Hadir'}
                    </Button>
                  </>
                )}




                <div className={booking.status === 'SELESAI' ? "space-y-2": `flex gap-2`}>
                  <Button
                    onClick={() => onExportAbsensiPdf(booking.Absensi?.link_absensi)}
                    icon={Upload}
                    disabled={exportLoading}
                    className="w-full justify-center bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    PDF
                  </Button>
                  <Button
                    onClick={() => onExportAbsensiExcel(booking.Absensi?.link_absensi)}
                    icon={FileX}
                    disabled={exportLoading}
                    className="w-full justify-center bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    Excel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center">
                Tidak ada aksi yang tersedia
              </div>
            )}
          </div>
        </div>
      </div>

      <AttendanceDialog
        isOpen={showAbsensi}
        onClose={() => setShowAbsensi(false)}
        listAbsensi={listAbsensi}
      />
    </>
  );
};

export default BookingCard;