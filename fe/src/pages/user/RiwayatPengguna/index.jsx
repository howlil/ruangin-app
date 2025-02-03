import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from "@/components/layout/MainLayout";
import api from "@/utils/api";
import { HandleResponse } from '@/components/ui/HandleResponse';
import BookingCard from './BookingCard';

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
  const [exportLoading, setExportLoading] = useState(false);

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
        HandleResponse({ error });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentStatus, currentPage]);

  const handleExportAbsensi = async (kode) => {
    const url = new URL(kode);
    const code = url.searchParams.get('u');
    
    try {
      setExportLoading(true);
      const response = await api.get(`/v1/absensi/${code}/export`, {
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `absensi-${code}.pdf`);

      document.body.appendChild(link);

      link.click();

      link.parentNode.removeChild(link);
    } catch (error) {
      HandleResponse({ error });
    } finally {
      setExportLoading(false);
    }
  };

  const handleStatusChange = (status) => {
    setSearchParams({ status });
  };

  const handlePageChange = (page) => {
    setSearchParams({ status: currentStatus, page: page.toString() });
  };

  return (
    <MainLayout>
      <div className="max-w-7xl px-4 sm:px-6 lg:px-20 py-20">
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
          <div className="space-y-4 ">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onExportAbsensi={handleExportAbsensi}
                exportLoading={exportLoading}
              />
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