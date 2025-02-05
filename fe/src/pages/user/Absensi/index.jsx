import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import React, { useEffect, useRef, useState } from 'react';
import api from '@/utils/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import SignatureCanvas from './SignatureCanvas';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { HandleResponse } from '@/components/ui/HandleResponse';

export default function Absensi() {
  const [searchParams] = useSearchParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const signatureRef = useRef()
  const initialFormData = {
    nama: "",
    no_hp: "",
    unit_kerja: "",
    golongan: "",
    jabatan: "",
    tanda_tangan: "",
    jenis_kelamin: "LAKI_LAKI"
  };
  const [formData, setFormData] = useState(initialFormData);

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
      setFormData(initialFormData);
      signatureRef.current?.reset();

    } catch (error) {
      HandleResponse({ error })
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
        <div className="p-6 bg-white rounded-xl shadow-sm w-full max-w-md">
          <div className="space-y-4">
            <div className="animate-pulse bg-gray-100 h-6 w-3/4 rounded" />
            <div className="space-y-2">
              <div className="animate-pulse bg-gray-100 h-4 w-full rounded" />
              <div className="animate-pulse bg-gray-100 h-4 w-5/6 rounded" />
              <div className="animate-pulse bg-gray-100 h-4 w-4/6 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Event Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <h2 className="text-xl font-semibold text-white">
              {eventDetails?.data?.peminjaman?.nama_kegiatan}
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">
                    {new Date(eventDetails?.data?.peminjaman?.tanggal).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">
                    {eventDetails?.data?.peminjaman?.jam_mulai} - {eventDetails?.data?.peminjaman?.jam_selesai}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">{eventDetails?.data?.peminjaman?.ruang_rapat}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900">Data Peserta</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Input
                      label="Nama Lengkap"
                      name="nama"
                      required
                      value={formData.nama}
                      onChange={handleChange}
                      fullWidth
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Input
                      label="No Hp"
                      name="no_hp"
                      value={formData.no_hp}
                      helperText="optional"
                      onChange={handleChange}
                      fullWidth
                      className="bg-gray-50"
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
                      className="bg-gray-50"
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
                      className="bg-gray-50"
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
                      className="bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Jenis Kelamin
                    </label>
                    <Select
                      name="jenis_kelamin"
                      value={formData.jenis_kelamin}
                      onChange={handleChange}
                      required
                      className="bg-gray-50 w-full"
                    >
                      <option value="LAKI_LAKI">Laki-laki</option>
                      <option value="PEREMPUAN">Perempuan</option>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Tanda Tangan</h3>
                </div>

                <SignatureCanvas
                  ref={signatureRef}
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
                  className="px-6"
                >
                  Kembali
                </Button>
                <Button
                  type="submit"
                  loading={submitting}
                  disabled={submitting}
                  className="px-6 bg-blue-600 hover:bg-blue-700"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}