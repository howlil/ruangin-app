import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import SignatureCanvas from './SignatureCanvas';
import { Calendar, Clock, MapPin, Building2, User, Briefcase, Users } from 'lucide-react';

export default function Absensi() {
  const [searchParams] = useSearchParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    unit_kerja: "",
    golongan: "",
    jabatan: "",
    tanda_tangan: "",
    jenis_kelamin: "LAKI_LAKI"
  });

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const kode = searchParams.get('u');
        const response = await api.get(`/v1/absensi/${kode}`);
        setEventDetails(response.data);
      } catch (error) {
        toast.error("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const kode = searchParams.get('u');
      await api.post(`/v1/absensi/${kode}`, formData);
      toast.success("Absensi berhasil dicatat!");
    } catch (error) {
      toast.error("Gagal mencatat absensi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-2xl shadow-lg w-full max-w-md">
          <div className="space-y-6">
            <div className="animate-pulse bg-gray-200 h-8 w-3/4 rounded-lg" />
            <div className="space-y-3">
              <div className="animate-pulse bg-gray-200 h-4 w-full rounded-lg" />
              <div className="animate-pulse bg-gray-200 h-4 w-5/6 rounded-lg" />
              <div className="animate-pulse bg-gray-200 h-4 w-4/6 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Card */}
        <div className="bg-white rounded-2xl  border overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-blue-800 p-6">
            <h2 className="text-2xl font-bold text-white mb-1">
              {eventDetails?.data?.peminjaman?.nama_kegiatan}
            </h2>
          </div>

          <div className="p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-4 flex items-start space-x-4">
                <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Tanggal</p>
                  <p className="text-sm text-gray-900">
                    {new Date(eventDetails?.data?.peminjaman?.tanggal).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 flex items-start space-x-4">
                <Clock className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Waktu</p>
                  <p className="text-sm text-gray-900">
                    {eventDetails?.data?.peminjaman?.jam_mulai} - {eventDetails?.data?.peminjaman?.jam_selesai} WIB
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Lokasi</p>
                  <p className="text-sm text-gray-900">{eventDetails?.data?.peminjaman?.ruang_rapat}</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 mt-12">
              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900">Informasi Peserta</h3>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-2">
                    <Input
                      label="Nama Lengkap"
                      name="nama"
                      required
                      value={formData.nama}
                      onChange={handleChange}
                      fullWidth
                      startIcon={<User className="w-4 h-4" />}
                    />
                  </div>

                  <div>
                    <Input
                      label="Unit Kerja"
                      name="unit_kerja"
                      required
                      value={formData.unit_kerja}
                      onChange={handleChange}
                      fullWidth
                      startIcon={<Building2 className="w-4 h-4" />}
                    />
                  </div>

                  <div>
                    <Input
                      label="Golongan"
                      name="golongan"
                      required
                      value={formData.golongan}
                      onChange={handleChange}
                      fullWidth
                      startIcon={<Users className="w-4 h-4" />}
                    />
                  </div>

                  <div>
                    <Input
                      label="Jabatan"
                      name="jabatan"
                      required
                      value={formData.jabatan}
                      onChange={handleChange}
                      fullWidth
                      startIcon={<Briefcase className="w-4 h-4" />}
                    />
                  </div>

                  <div>
                    <label className='text-sm font-medium '>                      Jenis Kelamin
                    </label>
                    <Select
                      name="jenis_kelamin"
                      value={formData.jenis_kelamin}
                      onChange={handleChange}
                      required
                      fullWidth
                    >
                      <option value="LAKI_LAKI">Laki-laki</option>
                      <option value="PEREMPUAN">Perempuan</option>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Tanda Tangan Digital</h3>
                </div>

                <SignatureCanvas
                  onChange={(base64) =>
                    setFormData(prev => ({ ...prev, tanda_tangan: base64 }))
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => window.history.back()}
                >
                  Kembali
                </Button>
                <Button
                  type="submit"
                  loading={submitting}
                  disabled={submitting}
                >
                  Submit Absensi
                </Button>
              </div>
            </form>
          </div>
        </div>


      </div>
    </div>
  );
}