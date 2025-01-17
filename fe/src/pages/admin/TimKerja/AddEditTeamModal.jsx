import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useState } from "react";
import api from "@/utils/api";
import { HandleResponse } from "@/components/ui/HandleResponse";


export default function AddEditTeamModal({
  isOpen,
  onClose,
  team = null,
  onSuccess
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_tim_kerja: team?.nama_tim_kerja || '',
    code: team?.code || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!formData.nama_tim_kerja || !formData.code) {
        return;
      }
      let response;
      if (team) {
        response = await api.patch(`/v1/tim-kerja/${team.id}`, formData);
        HandleResponse({ response })

      } else {
        response = await api.post('/v1/tim-kerja', formData);
        HandleResponse({ response })

      }

      onSuccess();
    } catch (error) {
      HandleResponse({
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      title={team ? 'Edit Tim' : 'Tambah Tim Baru'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kode Tim <span className="text-red-500">*</span>
          </label>
          <Input
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            placeholder="Masukkan kode tim"
            className="mt-1 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nama Tim <span className="text-red-500">*</span>
          </label>
          <Input
            name="nama_tim_kerja"
            value={formData.nama_tim_kerja}
            onChange={handleChange}
            required
            placeholder="Masukkan nama tim"
            className="mt-1 w-full"
          />
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
            {team ? 'Simpan Perubahan' : 'Tambah Tim'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}