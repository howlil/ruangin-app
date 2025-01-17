import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import Table from "@/components/ui/Table";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus } from 'lucide-react';
import api from "@/utils/api";
import DeleteConfirmationModal from '@/components/ui/modals/DeleteConfirmationModal';
import AddEditTeamModal from './AddEditTeamModal';
import { Toaster } from 'react-hot-toast';
import { HandleResponse } from '@/components/ui/HandleResponse';


export default function TeamKerja() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total_rows: 0,
    total_pages: 0
  });
  const [teamToEdit, setTeamToEdit] = useState(null);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/tim-kerja', {
        params: {
          page: pagination.page,
          size: pagination.size,
        }
      });

      if (response.data?.data) {
        setTeams(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setTeams([]);
      }
    } catch (error) {
      HandleResponse({
        error,
      });
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [pagination.page, pagination.size]);

  const handleDeleteTeam = async (id) => {
    try {
      const response = await api.delete(`/v1/tim-kerja/${id}`);
      HandleResponse({response})
      fetchTeams();
    } catch (error) {
      HandleResponse({
        error,
      });
    }
  };

  const headers = [
    { key: 'code', label: 'Kode Tim' },
    { key: 'nama_tim_kerja', label: 'Nama Tim' }
  ];

  const actions = [
    { key: 'edit', label: 'Edit Tim' },
    { key: 'delete', label: 'Hapus Tim', variant: 'danger' }
  ];

  // Action handlers
  const handleAction = (actionKey, team) => {
    switch (actionKey) {
      case 'edit':
        setTeamToEdit(team);
        break;
      case 'delete':
        setTeamToDelete(team);
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
              <h1 className="text-xl font-semibold text-gray-900">Tim Kerja</h1>
              <p className="mt-1 text-sm text-gray-500">
                Kelola data tim kerja
              </p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} icon={Plus}>
              Tambah Tim
            </Button>
          </div>
          <Table
            headers={headers}
            data={teams}
            pagination={pagination}
            onPageChange={(newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
            onPageSizeChange={(newSize) => setPagination(prev => ({ ...prev, size: newSize, page: 1 }))}
            actions={actions}
            onActionClick={handleAction}
            loading={loading}
          />
        </Card>
      </div>

      {/* Modals */}
      {(isAddModalOpen || teamToEdit) && (
        <AddEditTeamModal
          isOpen={isAddModalOpen || !!teamToEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setTeamToEdit(null);
          }}
          team={teamToEdit}
          onSuccess={() => {
            fetchTeams();
            setIsAddModalOpen(false);
            setTeamToEdit(null);
          }}
        />
      )}

      {teamToDelete && (
        <DeleteConfirmationModal
          isOpen={!!teamToDelete}
          onClose={() => setTeamToDelete(null)}
          onConfirm={() => {
            handleDeleteTeam(teamToDelete.id);
            setTeamToDelete(null);
          }}
          title="Hapus Tim"
          message={`Apakah Anda yakin ingin menghapus tim "${teamToDelete.nama_tim_kerja}"?`}
        />
      )}
    </DashboardLayout>
  );
}

