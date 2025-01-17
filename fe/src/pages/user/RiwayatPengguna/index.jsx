import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from "@/components/layout/MainLayout";
import api from "@/utils/api";
import { Calendar, Clock, MapPin, Users, FileText, Mail, User } from 'lucide-react';
import { HandleResponse } from '@/components/ui/HandleResponse';


const statusOptions = [
  { label: 'Diproses', value: 'DIPROSES' },
  { label: 'Disetujui', value: 'DISETUJUI' },
  { label: 'Ditolak', value: 'DITOLAK' },
  { label: 'Selesai', value: 'SELESAI' },
];

export default function RiwayatUser() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  
  const currentStatus = searchParams.get('status') || 'DIPROSES';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const PAGE_SIZE = 10;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/v1/peminjaman', {
          params: {
            status: currentStatus,
            page: currentPage,
            size: PAGE_SIZE
          }
        });
        setBookings(response.data.data);
        setTotalPages(Math.ceil(response.data.total / PAGE_SIZE));
      } catch (error) {
        HandleResponse({
          error,
        });
            } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentStatus, currentPage]);

  const handleStatusChange = (status) => {
    setSearchParams({ status });
  };

  const handlePageChange = (page) => {
    setSearchParams({ status: currentStatus, page: page.toString() });
  };

  return (
    <MainLayout>
      <div className="max-w-7xl  px-4 sm:px-6 lg:px-20 py-20">
        <h1 className="text-2xl font-bold mb-6">Riwayat</h1>
        
        {/* Status Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px space-x-8">
            {statusOptions.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleStatusChange(value)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${currentStatus === value
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada riwayat peminjaman</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="sm:flex sm:items-start sm:justify-between">
                  <div className="sm:flex sm:space-x-6">
                    {/* Image */}
                    <div className="flex-shrink-0 mb-4 sm:mb-0">
                      <img
                        src={`${import.meta.env.VITE_API_URL}${booking.RuangRapat.foto_ruangan }`}
                        alt={booking.RuangRapat.nama_ruangan}
                        className="h-32 w-44 object-cover rounded-lg"
                      />
                    </div>

                    {/* Main Content */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">
                          {booking.RuangRapat.nama_ruangan}
                        </h3>
                        <p className="text-blue-600 font-medium mt-1">{booking.nama_kegiatan}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{new Date(booking.tanggal).toLocaleDateString('id-ID', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{booking.jam_mulai} - {booking.jam_selesai} WIB</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{booking.RuangRapat.lokasi_ruangan}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            <span>Kapasitas: {booking.RuangRapat.kapasitas} orang</span>
                          </div>
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            <span>No. Surat Undangan: {booking.no_surat_peminjaman}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            <span>{booking.Pengguna.nama_lengkap}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0">
                    
                    {booking.alasan_penolakan && (
                      <p className="mt-2 text-sm text-red-600">
                        Alasan: {booking.alasan_penolakan}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`
                  px-3 py-1 rounded-md text-sm font-medium
                  ${currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}
                `}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}