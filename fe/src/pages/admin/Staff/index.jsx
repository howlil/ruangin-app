import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import Table from "@/components/ui/Table";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus } from 'lucide-react';
import api from "@/utils/api";
import useCustomToast from "@/components/ui/Toast/useCustomToast";
import DeleteConfirmationModal from '@/components/ui/modals/DeleteConfirmationModal';
import AddEditStaffModal from './AddEditStaffModal';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total_rows: 0,
    total_pages: 0
  });
  const [staffToEdit, setStaffToEdit] = useState(null);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { showToast } = useCustomToast();

  // Fetch teams data for dropdown
  const fetchTeams = async () => {
    try {
      const response = await api.get('/v1/tim-kerja');
      if (response.data?.data) {
        setTeams(response.data.data);
      }
    } catch (error) {
      showToast('Gagal mengambil data tim', 'error');
    }
  };

  // Fetch staff data
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/pengguna', {
        params: {
          page: pagination.page,
          size: pagination.size,
        }
      });

      if (response.data?.data) {
        setStaff(response.data.data);
        setPagination(response.data.pagination);
      } else {
        showToast("Tidak ada data yang ditemukan", "info");
        setStaff([]);
      }
    } catch (error) {
      showToast(error?.response?.data?.message || "Gagal mengambil data staff", "error");
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchStaff();
  }, [pagination.page, pagination.size]);

  // Delete staff handler
  const handleDeleteStaff = async (id) => {
    try {
      await api.delete(`/v1/users/${id}`);
      showToast('Staff berhasil dihapus', 'success');
      fetchStaff();
    } catch (error) {
      showToast(error?.response?.data?.message || 'Gagal menghapus staff', 'error');
    }
  };

  const headers = [
    { key: 'nama_lengkap', label: 'Nama Lengkap' },
    { key: 'email', label: 'Email' },
    {
      key: 'kontak', label: 'Kontak', render: (row) => row.detail?.kontak || '-'
    },
    {
      key: 'role',
      label: 'Role',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
          }`}>
          {row.role}
        </span>
      )
    },
    {
      key: 'tim_kerja',
      label: 'Tim Kerja',
      render: (row) => row.detail?.tim_kerja || '-'
    }
  ];

  const actions = [
    { key: 'edit', label: 'Edit Staff' },
    { key: 'delete', label: 'Hapus Staff', variant: 'danger' }
  ];

  const handleAction = (actionKey, staff) => {
    switch (actionKey) {
      case 'edit':
        setStaffToEdit(staff);
        break;
      case 'delete':
        setStaffToDelete(staff);
        break;
      default:
        break;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex mb-4 flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Manajemen Staff</h1>
              <p className="mt-1 text-sm text-gray-500">
                Kelola data staff dan pengguna sistem
              </p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} icon={Plus}>
              Tambah Staff
            </Button>
          </div>
          <div className='overflow-x-scroll no-scrollbar'>
            <Table
              headers={headers}
              data={staff}
              pagination={pagination}
              onPageChange={(newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
              onPageSizeChange={(newSize) => setPagination(prev => ({ ...prev, size: newSize, page: 1 }))}
              actions={actions}
              onActionClick={handleAction}
              loading={loading}
            />
          </div>
        </Card>
      </div>

      {(isAddModalOpen || staffToEdit) && (
        <AddEditStaffModal
          isOpen={isAddModalOpen || !!staffToEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setStaffToEdit(null);
          }}
          staff={staffToEdit}
          teams={teams}
          onSuccess={() => {
            fetchStaff();
            showToast(
              staffToEdit ? 'Staff berhasil diperbarui' : 'Staff berhasil ditambahkan',
              'success'
            );
            setIsAddModalOpen(false);
            setStaffToEdit(null);
          }}
        />
      )}

      {staffToDelete && (
        <DeleteConfirmationModal
          isOpen={!!staffToDelete}
          onClose={() => setStaffToDelete(null)}
          onConfirm={() => {
            handleDeleteStaff(staffToDelete.id);
            setStaffToDelete(null);
          }}
          title="Hapus Staff"
          message={`Apakah Anda yakin ingin menghapus staff "${staffToDelete.nama_lengkap}"?`}
        />
      )}
    </DashboardLayout>
  );
}
