import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
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
    code: team?.code || '',
    is_aktif: team?.is_aktif === undefined ? 'true' : String(team.is_aktif)
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

      const dataToSubmit = {
        ...formData,
        is_aktif: formData.is_aktif
      };

      let response;
      if (team) {
        response = await api.patch(`/v1/tim-kerja/${team.id}`, dataToSubmit);
        HandleResponse({ response });
      } else {
        response = await api.post('/v1/tim-kerja', dataToSubmit);
        HandleResponse({ response });
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

        <Input
          name="code"
          label="Kode Tim "
          value={formData.code}
          onChange={handleChange}
          required
          fullWidth
          placeholder="Masukkan kode tim"
          className="mt-1"
        />

        <Input
          name="nama_tim_kerja"
          value={formData.nama_tim_kerja}
          onChange={handleChange}
          fullWidth
          label="Nama Tim "
          required
          placeholder="Masukkan nama tim"
          className="mt-1"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status <span className="text-red-500">*</span>
          </label>
          <Select
            name="is_aktif"
            value={formData.is_aktif}
            onChange={handleChange}
            required
            className="mt-1"
            disabled={loading}
          >
            <option value="true">Aktif</option>
            <option value="false">Non Aktif</option>
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
            {team ? 'Simpan Perubahan' : 'Tambah Tim'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}