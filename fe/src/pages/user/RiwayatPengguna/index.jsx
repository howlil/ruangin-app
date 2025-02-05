import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from "@/components/layout/MainLayout";
import api from "@/utils/api";
import { HandleResponse } from '@/components/ui/HandleResponse';
import BookingCard from './BookingCard';
import Pagination from '@/components/ui/Pagination';

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
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total_rows: 0,
    total_pages: 1
  });
  const [exportLoading, setExportLoading] = useState(false);

  const currentStatus = searchParams.get('status') || 'DIPROSES';

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/v1/peminjaman', {
          params: {
            status: currentStatus,
            page: pagination.page,
            size: pagination.size
          }
        });
        setBookings(response.data.data);
        setPagination(response.data.pagination);
      } catch (error) {
        HandleResponse({ error });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentStatus, pagination.page, pagination.size]);

  const handleExportAbsensiPdf = async (kode) => {
    const url = new URL(kode);
    const code = url.searchParams.get('u');

    try {
      setExportLoading(true);
      const response = await api.get(`/v1/absensi/${code}/export`, {
        responseType: 'blob'
      });

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

  const handleExportAbsensiExcel = async (kode) => {
    const url = new URL(kode);
    const code = url.searchParams.get('u');
    try {
      const response = await api.get(`/v1/absensi/${code}/excel`, {
        responseType: 'arraybuffer'
      });

      const contentType = response.headers['content-type'];
      if (contentType.includes('application/json')) {
        const decoder = new TextDecoder('utf-8');
        const jsonString = decoder.decode(response.data);
        const errorData = JSON.parse(jsonString);
        throw new Error(errorData.message || 'Unknown error occurred');
      }

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const fileName = 'absensi.xlsx';
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();

      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      HandleResponse({ error });
    }
  };

  const handleFetchAbsensi = async (kode) => {
    const url = new URL(kode);
    const code = url.searchParams.get('u');
    try {
      const { data } = await api.get(`/v1/absensi/${code}/list`);
      return data.data.list_absensi;
    } catch (error) {
      HandleResponse({ error });
      throw error;
    }
  };

  const handleStatusChange = (status) => {
    setSearchParams({ status, page: '1' });
  };

  const handlePageChange = (page) => {
    setSearchParams({ status: currentStatus, page: page.toString() });
  };

  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({
      ...prev,
      size: newSize,
      page: 1
    }));
    setSearchParams({ status: currentStatus, page: '1' });
  };

  return (
    <MainLayout>
      <div className="max-w-7xl px-4 min-h-svh sm:px-6 lg:px-20 py-20">
        <h1 className="text-2xl font-bold mb-6">Riwayat</h1>

        {/* Status Tabs */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar md:overscroll-none">
          <nav className="flex -mb-px space-x-8 min-w-max">
            {statusOptions.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleStatusChange(value)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada riwayat peminjaman</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onExportAbsensiPdf={handleExportAbsensiPdf}
                onExportAbsensiExcel={handleExportAbsensiExcel}
                onFetchAbsensi={handleFetchAbsensi}
                exportLoading={exportLoading}
              />
            ))}

            <Pagination
              data={bookings}
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}