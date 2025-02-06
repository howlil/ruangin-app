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

  const [exportLoading, setExportLoading] = useState(false);

  // Get values from URL params
  const currentStatus = searchParams.get('status') || 'DIPROSES';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('size') || '10', 10);

  // Initialize pagination state from URL params
  const [pagination, setPagination] = useState({
    page: currentPage,
    size: pageSize,
    total_rows: 0,
    total_pages: 1
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/v1/peminjaman', {
          params: {
            status: currentStatus,
            page: currentPage,
            size: pageSize
          }
        });
        setBookings(response.data.data);
        setPagination(prev => ({
          ...prev,
          ...response.data.pagination,
          page: currentPage,
          size: pageSize
        }));
      } catch (error) {
        HandleResponse({ error });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentStatus, currentPage, pageSize]);

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
    setSearchParams({ 
      status, 
      page: '1',
      size: pageSize.toString() 
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ 
      status: currentStatus, 
      page: newPage.toString(),
      size: pageSize.toString()
    });
  };

  const handlePageSizeChange = (newSize) => {
    setSearchParams({ 
      status: currentStatus, 
      page: '1',
      size: newSize.toString() 
    });
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
              pagination={{
                ...pagination,
                page: currentPage,
                size: pageSize
              }}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}