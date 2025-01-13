// src/pages/admin/Peminjaman/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/layout/DashboardLayout";
import Table from "@/components/ui/Table";
import { Card } from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import DateRangePicker from "@/components/ui/Calenders/DateRangePicker";
import { Eye } from 'lucide-react';
import api from "@/utils/api";
import useCustomToast from "@/components/ui/Toast/useCustomToast";

export default function AjuanPeminjaman() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total_rows: 0,
    total_pages: 0
  });

  const [filters, setFilters] = useState({
    ruangRapatId: '',
    tanggalMulai: undefined,
    tanggalAkhir: undefined
  });

  const navigate = useNavigate();
  const { showToast } = useCustomToast();

  const fetchRooms = async () => {
    try {
      const response = await api.get('/v1/ruang-rapat');
      if (response.data?.data) {
        setRooms(response.data.data);
      }
    } catch (error) {
      showToast('Gagal mengambil data ruangan', 'error');
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        size: pagination.size,
        ruangRapatId: filters.ruangRapatId || undefined,
        tanggalMulai: filters.tanggalMulai,
        tanggalAkhir: filters.tanggalAkhir
      };

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await api.get('/v2/peminjaman/diproses', { params });

      if (response.data?.data) {
        setBookings(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      showToast('Gagal mengambil data peminjaman', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [pagination.page, pagination.size, filters]);

  useEffect(() => {
    if (selectedDate) {
      setFilters(prev => ({
        ...prev,
        tanggalMulai: selectedDate.start_date,
        tanggalAkhir: selectedDate.end_date
      }));
    }
  }, [selectedDate]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDateReset = () => {
    setSelectedDate(null);
    setFilters(prev => ({
      ...prev,
      tanggalMulai: undefined,
      tanggalAkhir: undefined
    }));
  };

  const headers = [
    {
      key: 'ruang_rapat',
      label: 'RUANGAN',
      render: (row) => (
        <div>
          <div className="font-medium">{row.RuangRapat?.nama_ruangan}</div>
          <div className="text-sm text-gray-500">{row.RuangRapat?.lokasi_ruangan}</div>
        </div>
      )
    },
    {
      key: 'nama_kegiatan',
      label: 'KEGIATAN',
      render: (row) => (
        <div>
          <div className="font-medium">{row.nama_kegiatan}</div>
          <div className="text-sm text-gray-500">
            {row.jam_mulai} - {row.jam_selesai}
          </div>
        </div>
      )
    },
    {
      key: 'peminjam',
      label: 'PEMINJAM',
      render: (row) => (
        <div>
          <div className="font-medium">{row.Pengguna?.nama_lengkap}</div>
          <div className="text-sm text-gray-500">{row.Pengguna?.DetailPengguna?.tim_kerja?.nama_tim_kerja}</div>
        </div>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <button
          onClick={() => navigate(`/ajuan-peminjaman/${row.id}`)}
          className="text-gray-400 hover:text-primary"
        >
          <Eye className="w-5 h-5" />
        </button>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Card className="p-4">
          <div className='mb-8'>
            <h1 className="text-xl font-semibold text-gray-900">Ajuan Peminjaman</h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola ajuan peminjaman ruangan yang masih diproses
            </p>
          </div>

          <div className="grid mb-4 grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ruangan
              </label>
              <Select
                value={filters.ruangRapatId}
                onChange={(e) => handleFilterChange('ruangRapatId', e.target.value)}
                className="w-full"
              >
                <option value="">Semua Ruangan</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.nama_ruangan} - {room.lokasi_ruangan}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rentang Tanggal
              </label>
              <DateRangePicker
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                onReset={handleDateReset}
              />
            </div>
          </div>

          <div className='overflow-x-auto no-scrollbar'>
            <Table
              headers={headers}
              data={bookings}
              pagination={pagination}
              onPageChange={(newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
              onPageSizeChange={(newSize) => setPagination(prev => ({ ...prev, size: newSize, page: 1 }))}
              loading={loading}
            />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}