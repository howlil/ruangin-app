import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { ArrowLeft } from 'lucide-react';
import api from "@/utils/api";
import { format, isAfter, parseISO } from "date-fns";
import { HandleResponse } from '@/components/ui/HandleResponse';
import { showToast } from '@/components/ui/Toast';

export default function DetailPeminjaman() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [booking, setBooking] = useState(null);
  const [formData, setFormData] = useState({
    ruang_rapat_id: '',
    nama_kegiatan: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    jam_mulai: '',
    jam_selesai: '',
    status: '',
    alasan_penolakan: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookingRes, roomsRes] = await Promise.all([
          api.get(`/v1/peminjaman/${id}`),
          api.get('/v1/ruang-rapat')
        ]);

        if (bookingRes.data?.data) {
          const data = bookingRes.data.data;
          setBooking(data);
          setFormData({
            ruang_rapat_id: data.ruang_rapat_id,
            nama_kegiatan: data.nama_kegiatan,
            tanggal_mulai: data.tanggal_mulai,
            tanggal_selesai: data.tanggal_selesai || '',
            jam_mulai: data.jam_mulai,
            jam_selesai: data.jam_selesai,
            status: '',
            alasan_penolakan: ''
          });
        }

        if (roomsRes.data?.data) {
          setRooms(roomsRes.data.data);
        }
      } catch (error) {
        navigate('/ajuan-peminjaman');
        HandleResponse({
          error,
          errorMessage: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const validateTime = (time) => {
    const timeFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeFormat.test(time);
  };

  const validateForm = () => {
    // Validate time format
    if (!validateTime(formData.jam_mulai) || !validateTime(formData.jam_selesai)) {
      showToast("jam harus diisi", "error");
      return false;
    }

    // Compare times
    const [startHour, startMinute] = formData.jam_mulai.split(':').map(Number);
    const [endHour, endMinute] = formData.jam_selesai.split(':').map(Number);
    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;

    if (endTotal <= startTotal) {
      showToast("Jam mulai tidak boleh lewat dari jam selesai", "error");
      return false;
    }

    // Validate dates
    if (!formData.tanggal_mulai) {
      showToast("Tanggal mulai wajib diisi", "error");
      return false;
    }

    // If end date is provided, validate it's after start date
    if (formData.tanggal_selesai && isAfter(parseISO(formData.tanggal_mulai), parseISO(formData.tanggal_selesai))) {
      showToast("Tanggal selesai harus setelah tanggal mulai", "error");
      return false;
    }

    if (formData.status === 'DITOLAK' && !formData.alasan_penolakan) {
      showToast("Alasan Penolakan Wajib diisi", "error");
      return false;
    }

    return true;
  };

  const handleUpdateStatus = async () => {
    try {
      if (!validateForm()) return;

      setSaving(true);

      const payload = {
        ruang_rapat_id: formData.ruang_rapat_id,
        nama_kegiatan: formData.nama_kegiatan,
        tanggal_mulai: formData.tanggal_mulai,
        tanggal_selesai: formData.tanggal_selesai || null,
        jam_mulai: formData.jam_mulai,
        jam_selesai: formData.jam_selesai,
        status: formData.status,
        alasan_penolakan: formData.status === 'DITOLAK' ? formData.alasan_penolakan : undefined
      };

      const response = await api.patch(`/v1/peminjaman/${id}/status`, payload);
      HandleResponse({ response })

      navigate('/ajuan-peminjaman');
    } catch (error) {
      HandleResponse({
        error,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !booking) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const selectedRoom = rooms.find(r => r.id === formData.ruang_rapat_id) || booking.RuangRapat;

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Card className="p-4">
          {/* Header section remains the same */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/ajuan-peminjaman')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">Detail Peminjaman</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informasi Peminjam section remains the same */}
            <div className="space-y-4">
              <h2 className="font-medium">Informasi Peminjam</h2>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
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
            </div>

            {/* Informasi Ruangan section remains the same */}
            <div className="space-y-4">
              <h2 className="font-medium">Informasi Ruangan</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ruangan <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.ruang_rapat_id}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      ruang_rapat_id: e.target.value
                    }))}
                    className="mt-1"
                  >
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>
                        {room.nama_ruangan} - {room.lokasi_ruangan}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Lokasi</label>
                    <p>{selectedRoom?.lokasi_ruangan}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Kapasitas</label>
                    <p>{selectedRoom?.kapasitas} Orang</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Peminjaman section with updated date fields */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-medium">Detail Peminjaman</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nama Kegiatan"
                  fullWidth
                  value={formData.nama_kegiatan}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    nama_kegiatan: e.target.value
                  }))}
                  placeholder="Masukkan nama kegiatan"
                  className="mt-1"
                />

                <Input
                  type="text"
                  label="Nomor Surat"
                  fullWidth
                  value={booking.no_surat_peminjaman}
                  className="mt-1"
                  disabled
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    label="Tanggal Mulai"
                    required
                    fullWidth
                    value={formData.tanggal_mulai}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      tanggal_mulai: e.target.value
                    }))}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="mt-1"
                  />

                  <Input
                    type="date"
                    label="Tanggal Selesai"
                    fullWidth
                    value={formData.tanggal_selesai}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      tanggal_selesai: e.target.value
                    }))}
                    min={formData.tanggal_mulai}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="time"
                    fullWidth
                    label="Jam Mulai"
                    helperText="Format: HH:mm"
                    value={formData.jam_mulai}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      jam_mulai: e.target.value
                    }))}
                    className="mt-1"
                  />

                  <Input
                    type="time"
                    fullWidth
                    label="Jam Selesai"
                    helperText="Format: HH:mm"
                    value={formData.jam_selesai}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      jam_selesai: e.target.value
                    }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Form Persetujuan section remains the same */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-medium">Persetujuan Peminjaman</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1"
                  >
                    <option value="">Pilih Status</option>
                    <option value="DISETUJUI">Setujui</option>
                    <option value="DITOLAK">Tolak</option>
                  </Select>
                </div>

                {formData.status === 'DITOLAK' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
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
                      fullWidth
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons section remains the same */}
            <div className="lg:col-span-2 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => navigate('/ajuan-peminjaman')}
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
    </DashboardLayout>
  );
}