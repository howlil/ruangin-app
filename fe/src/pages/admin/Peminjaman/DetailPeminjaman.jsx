// src/pages/admin/Peminjaman/detail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { ArrowLeft } from 'lucide-react';
import api from "@/utils/api";
import useCustomToast from "@/components/ui/Toast/useCustomToast";

export default function DetailPeminjaman() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useCustomToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [booking, setBooking] = useState(null);
  const [formData, setFormData] = useState({
    ruang_rapat_id: '',
    nama_kegiatan: '',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: '',
    status: '',
    alasan_penolakan: ''
  });

  // Fetch detail data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingRes, roomsRes] = await Promise.all([
          api.get(`/v1/peminjaman/${id}`),
          api.get('/v1/ruang-rapat')
        ]);

        if (bookingRes.data?.data) {
          setBooking(bookingRes.data.data);
          setFormData({
            ruang_rapat_id: bookingRes.data.data.ruang_rapat_id,
            nama_kegiatan: bookingRes.data.data.nama_kegiatan,
            tanggal: bookingRes.data.data.tanggal,
            jam_mulai: bookingRes.data.data.jam_mulai,
            jam_selesai: bookingRes.data.data.jam_selesai,
            status: '',
            alasan_penolakan: ''
          });
        }
        
        if (roomsRes.data?.data) {
          setRooms(roomsRes.data.data);
        }
      } catch (error) {
        showToast('Gagal mengambil data', 'error');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdateStatus = async () => {
    try {
      setSaving(true);

      // Validate required fields if status is DITOLAK
      if (formData.status === 'DITOLAK' && !formData.alasan_penolakan) {
        showToast('Alasan penolakan harus diisi', 'error');
        return;
      }

      await api.patch(`/api/v1/peminjaman/${id}/status`, {
        status: formData.status,
        alasan_penolakan: formData.status === 'DITOLAK' ? formData.alasan_penolakan : undefined
      });

      showToast('Status berhasil diperbarui', 'success');
      navigate('/ajuan-peminjaman');
    } catch (error) {
      showToast(error?.response?.data?.message || 'Gagal memperbarui status', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !booking) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Detail Peminjaman</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Informasi Peminjam */}
          <Card className="p-4">
            <h2 className="font-medium mb-4">Informasi Peminjam</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Nama</label>
                <p className="font-medium">{booking.Pengguna?.nama_lengkap}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p>{booking.Pengguna?.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Tim Kerja</label>
                <p>{booking.Pengguna?.DetailPengguna?.tim_kerja?.nama_tim_kerja}</p>
              </div>
            </div>
          </Card>

          {/* Informasi Ruangan */}
          <Card className="p-4">
            <h2 className="font-medium mb-4">Informasi Ruangan</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Nama Ruangan</label>
                <p className="font-medium">{booking.RuangRapat?.nama_ruangan}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Lokasi</label>
                <p>{booking.RuangRapat?.lokasi_ruangan}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Kapasitas</label>
                <p>{booking.RuangRapat?.kapasitas} Orang</p>
              </div>
            </div>
          </Card>

          {/* Detail Peminjaman */}
          <Card className="p-4 lg:col-span-2">
            <h2 className="font-medium mb-4">Detail Peminjaman</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Nama Kegiatan</label>
                <p className="font-medium">{booking.nama_kegiatan}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Nomor Surat</label>
                <p>{booking.no_surat_peminjaman || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Tanggal</label>
                <p>{booking.tanggal}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Waktu</label>
                <p>{booking.jam_mulai} - {booking.jam_selesai}</p>
              </div>
            </div>
          </Card>

          {/* Form Persetujuan */}
          <Card className="p-4 lg:col-span-2">
            <h2 className="font-medium mb-4">Persetujuan Peminjaman</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    status: e.target.value,
                    alasan_penolakan: e.target.value !== 'DITOLAK' ? '' : prev.alasan_penolakan 
                  }))}
                  required
                >
                  <option value="">Pilih Status</option>
                  <option value="DISETUJUI">Setujui</option>
                  <option value="DITOLAK">Tolak</option>
                </Select>
              </div>

              {formData.status === 'DITOLAK' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alasan Penolakan <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.alasan_penolakan}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      alasan_penolakan: e.target.value 
                    }))}
                    placeholder="Masukkan alasan penolakan"
                    required
                  />
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate(-1)}
                  disabled={saving}
                >
                  Kembali
                </Button>
                <Button
                  onClick={handleUpdateStatus}
                  loading={saving}
                  disabled={!formData.status}
                >
                  Simpan
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}