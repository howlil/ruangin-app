// src/pages/Ruangan/index.jsx
import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import Table from "@/components/ui/Table";
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import api from "@/utils/api";
import RoomDetailsModal from './RoomDetailsModal';
import AddEditRoomModal from './AddEditRoomModal';
import DeleteConfirmationModal from '@/components/ui/modals/DeleteConfirmationModal';
import { HandleResponse } from '@/components/ui/HandleResponse';
import { Toaster } from 'react-hot-toast';

export default function Ruangan() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total_rows: 0,
    total_pages: 0
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomToEdit, setRoomToEdit] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/ruang-rapat', {
        params: {
          page: pagination.page,
          size: pagination.size,
        }
      });

      if (response.data?.data) {
        const formattedRooms = response.data.data.map(room => ({
          ...room,
          kapasitas: `${room.kapasitas} Orang`,
          total_bookings: (room.peminjaman || []).length
        }));

        setRooms(formattedRooms);
        setPagination(response.data.pagination);
      } else {
        setRooms([]);
      }
    } catch (error) {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [pagination.page, pagination.size]);

  const handleDeleteRoom = async (id) => {
    try {
      const response = await api.delete(`/v1/ruang-rapat/${id}`);
      HandleResponse({
        response,
        successMessage: 'Ruangan berhasil dihapus'
      });
      fetchRooms();
    } catch (error) {
      HandleResponse({
        error,
        errorMessage: 'Gagal menghapus ruangan'
      });
    }
  };

  const headers = [
    {
      key: 'nama_ruangan',
      label: 'Nama Ruangan',
    },
    { key: 'lokasi_ruangan', label: 'Lokasi' },
    { key: 'kapasitas', label: 'Kapasitas' },
    {
      key: 'total_bookings',
      label: 'Total Booking',
    }
  ];

  const actions = [
    { key: 'view', label: 'Lihat Detail' },
    { key: 'edit', label: 'Edit Ruangan' },
    { key: 'delete', label: 'Hapus Ruangan', variant: 'danger' }
  ];

  const handleAction = (actionKey, room) => {
    switch (actionKey) {
      case 'view':
        setSelectedRoom(room);
        break;
      case 'edit':
        setRoomToEdit(room);
        break;
      case 'delete':
        setRoomToDelete(room);
        break;
      default:
        break;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Toaster/>

        <Card className="p-4">
          <div className="flex flex-col mb-6 sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Daftar Ruangan</h1>
              <p className="mt-1 text-sm text-gray-500">
                Kelola ruangan yang tersedia untuk peminjaman
              </p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} icon={Plus}>
              Tambah Ruangan
            </Button>
          </div>
          <Table
            headers={headers}
            data={rooms}
            pagination={pagination}
            onPageChange={(newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
            onPageSizeChange={(newSize) => setPagination(prev => ({ ...prev, size: newSize, page: 1 }))}
            actions={actions}
            onActionClick={handleAction}
            loading={loading}
          />
        </Card>
      </div>

      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}

      {(isAddModalOpen || roomToEdit) && (
        <AddEditRoomModal
          isOpen={isAddModalOpen || !!roomToEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setRoomToEdit(null);
          }}
          room={roomToEdit}
          onSuccess={() => {
            fetchRooms();
  
            setIsAddModalOpen(false);
            setRoomToEdit(null);
          }}
        />
      )}

      {roomToDelete && (
        <DeleteConfirmationModal
          isOpen={!!roomToDelete}
          onClose={() => setRoomToDelete(null)}
          onConfirm={() => {
            handleDeleteRoom(roomToDelete.id);
            setRoomToDelete(null);
          }}
          title="Hapus Ruangan"
          message={`Apakah Anda yakin ingin menghapus ruangan "${roomToDelete.nama_ruangan}"?`}
        />
      )}
    </DashboardLayout>
  );
}