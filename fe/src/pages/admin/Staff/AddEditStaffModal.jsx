import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useState } from "react";
import api from "@/utils/api";
import { HandleResponse } from "@/components/ui/HandleResponse";

export default function AddEditStaffModal({
  isOpen,
  onClose,
  staff = null,
  teams = [],
  onSuccess
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: staff?.email || '',
    nama_lengkap: staff?.nama_lengkap || '',
    role: staff?.role || 'PEMINJAM',
    kontak: staff?.kontak || '',
    tim_kerja_id: staff?.tim_kerja_id || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let response;
      if (staff) {
        response = await api.patch(`/v1/users/${staff.id}`, formData);
        HandleResponse({ response })

      } else {
        response = await api.post('/v1/register', formData);
        HandleResponse({ response })

      }

      onSuccess();
    } catch (error) {
      HandleResponse({
        error: error,
        errorMessage: 'Gagal melakukan login'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title={staff ? 'Edit Staff' : 'Tambah Staff Baru'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Masukkan email"
            className="mt-1 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <Input
            name="nama_lengkap"
            value={formData.nama_lengkap}
            onChange={handleChange}
            required
            placeholder="Masukkan nama lengkap"
            className="mt-1 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role <span className="text-red-500">*</span>
          </label>
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="mt-1"
          >
            <option value="PEMINJAM">Peminjam</option>
            <option value="ADMIN">Admin</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kontak <span className="text-red-500">*</span>
          </label>
          <Input
            name="kontak"
            value={formData.kontak}
            onChange={handleChange}
            required
            placeholder="Masukkan nomor kontak"
            className="mt-1 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tim Kerja <span className="text-red-500">*</span>
          </label>
          <Select
            name="tim_kerja_id"
            value={formData.tim_kerja_id}
            onChange={handleChange}
            required
            className="mt-1"
          >
            <option value="">Pilih Tim Kerja</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.nama_tim_kerja}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button type="submit" loading={loading}>
            {staff ? 'Simpan Perubahan' : 'Tambah Staff'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}