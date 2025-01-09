// src/pages/Riwayat/index.jsx
import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import Table from "@/components/ui/Table";
import DateRangePicker from "@/components/ui/Calenders/DateRangePicker";
import { Card } from "@/components/ui/Card";
import Select from '@/components/ui/Select';
import api from "@/utils/api";
import useCustomToast from "@/components/ui/Toast/useCustomToast";
import { format } from "date-fns";
import { id } from 'date-fns/locale';
import EditBookingModal from './EditBookingModal';

export default function Riwayat() {
 const [bookings, setBookings] = useState([]);
 const [rooms, setRooms] = useState([]);
 const [loading, setLoading] = useState(true);
 const [selectedDate, setSelectedDate] = useState(null);
 const [pagination, setPagination] = useState({
   page: 1,
   size: 10,
   total_rows: 0,
   total_pages: 0
 });
 const [bookingToEdit, setBookingToEdit] = useState(null);

 const [filters, setFilters] = useState({
   status: '',
   ruangRapatId: '',
   tanggalMulai: undefined,
   tanggalAkhir: undefined
 });

 const { showToast } = useCustomToast();

 const fetchRooms = async () => {
   try {
     const response = await api.get('/v1/ruang-rapat');
     if (response.data?.data) {
       setRooms(response.data.data);
     }
   } catch (error) {
     showToast('Gagal mengambil data ruangan', 'error');
   }
 };

 const fetchBookings = async () => {
   try {
     setLoading(true);
     const params = {
       page: pagination.page,
       size: pagination.size,
       status: filters.status || undefined,
       ruangRapatId: filters.ruangRapatId || undefined,
       tanggalMulai: filters.tanggalMulai,
       tanggalAkhir: filters.tanggalAkhir
     };

     Object.keys(params).forEach(key => {
       if (params[key] === undefined) {
         delete params[key];
       }
     });

     const response = await api.get('/v2/peminjaman', { params });

     if (response.data?.data) {
       setBookings(response.data.data);
       setPagination(response.data.pagination);
     }
   } catch (error) {
     showToast('Gagal mengambil data peminjaman', 'error');
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   fetchRooms();
 }, []);

 useEffect(() => {
   fetchBookings();
 }, [pagination.page, pagination.size, filters]);

 useEffect(() => {
   if (selectedDate) {
     setFilters(prev => ({
       ...prev,
       tanggalMulai: selectedDate.start_date,
       tanggalAkhir: selectedDate.end_date
     }));
     setPagination(prev => ({ ...prev, page: 1 }));
   }
 }, [selectedDate]);

 const handleFilterChange = (name, value) => {
   setFilters(prev => ({
     ...prev,
     [name]: value
   }));
   setPagination(prev => ({ ...prev, page: 1 }));
 };

 const handleDateReset = () => {
   setSelectedDate(null);
   setFilters(prev => ({
     ...prev,
     tanggalMulai: undefined,
     tanggalAkhir: undefined
   }));
 };

 const actions = [
   { 
     key: 'edit', 
     label: 'Edit Peminjaman',
     show: (row) => row.status === 'DISETUJUI'
   }
 ];

 const handleAction = (actionKey, booking) => {
   switch (actionKey) {
     case 'edit':
       setBookingToEdit(booking);
       break;
     default:
       break;
   }
 };

 const headers = [
   {
     key: 'ruang_rapat',
     label: 'RUANGAN',
     render: (row) => (
       <div>
         <div className="font-medium">{row.RuangRapat?.nama_ruangan}</div>
         <div className="text-sm text-gray-500">{row.RuangRapat?.lokasi_ruangan}</div>
         <div className="text-xs text-gray-500">Kapasitas: {row.RuangRapat?.kapasitas}</div>
       </div>
     )
   },
   {
     key: 'nama_kegiatan',
     label: 'KEGIATAN',
     render: (row) => (
       <div>
         <div className="font-medium">{row.nama_kegiatan}</div>
         <div className="text-xs text-gray-500">No. Surat: {row.no_surat_peminjaman || '-'}</div>
       </div>
     )
   },
   {
     key: 'tanggal',
     label: 'TANGGAL & WAKTU',
     render: (row) => (
       <div>
         <div>{format(new Date(row.tanggal), 'EEEE, dd MMMM yyyy', { locale: id })}</div>
         <div className="text-sm text-gray-500">
           {row.jam_mulai} - {row.jam_selesai}
         </div>
       </div>
     )
   },
   {
     key: 'peminjam',
     label: 'PEMINJAM',
     render: (row) => (
       <div>
         <div className="font-medium">{row.Pengguna?.nama_lengkap}</div>
         <div className="text-sm text-gray-500">{row.Pengguna?.email}</div>
         <div className="text-xs text-gray-500 mt-1">
           {row.Pengguna?.DetailPengguna?.tim_kerja?.nama_tim_kerja}
         </div>
       </div>
     )
   },
   {
     key: 'status',
     label: 'STATUS',
     render: (row) => (
       <div>
         <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
           row.status === 'DISETUJUI' ? 'bg-green-100 text-green-800' :
           row.status === 'DITOLAK' ? 'bg-red-100 text-red-800' :
           'bg-blue-100 text-blue-800'
         }`}>
           {row.status}
         </span>
         {row.alasan_penolakan && (
           <div className="mt-1 text-xs text-red-500">
             Alasan: {row.alasan_penolakan}
           </div>
         )}
         <div className="text-xs text-gray-500 mt-1">
           {format(new Date(row.updatedAt), 'dd/MM/yyyy HH:mm')}
         </div>
       </div>
     )
   }
 ];

 return (
   <DashboardLayout>
     <div className="space-y-4">
       <Card className="p-4">
         <div className='mb-8'>
           <h1 className="text-xl font-semibold text-gray-900">Riwayat Peminjaman</h1>
           <p className="mt-1 text-sm text-gray-500">
             Lihat dan filter riwayat peminjaman ruangan
           </p>
         </div>

         <div className="grid mb-4 grid-cols-1 md:grid-cols-3 gap-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Status Peminjaman
             </label>
             <Select
               value={filters.status}
               onChange={(e) => handleFilterChange('status', e.target.value)}
               className="w-full"
             >
               <option value="">Semua Status</option>
               <option value="DISETUJUI">Disetujui</option>
               <option value="DITOLAK">Ditolak</option>
               <option value="SELESAI">Selesai</option>
             </Select>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Ruangan
             </label>
             <Select
               value={filters.ruangRapatId}
               onChange={(e) => handleFilterChange('ruangRapatId', e.target.value)}
               className="w-full"
             >
               <option value="">Semua Ruangan</option>
               {rooms.map(room => (
                 <option key={room.id} value={room.id}>
                   {room.nama_ruangan} - {room.lokasi_ruangan}
                 </option>
               ))}
             </Select>
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Rentang Tanggal
             </label>
             <DateRangePicker
               selectedDate={selectedDate}
               setSelectedDate={setSelectedDate}
               onReset={handleDateReset}
             />
           </div>
         </div>

         <div className='overflow-x-auto no-scrollbar'>
           <Table
             headers={headers}
             data={bookings}
             pagination={pagination}
             onPageChange={(newPage) => setPagination(prev => ({ ...prev, page: newPage }))}
             onPageSizeChange={(newSize) => setPagination(prev => ({ ...prev, size: newSize, page: 1 }))}
             loading={loading}
             actions={actions}
             onActionClick={handleAction}
           />
         </div>
       </Card>
     </div>

     {bookingToEdit && (
       <EditBookingModal
         isOpen={!!bookingToEdit}
         booking={bookingToEdit}
         rooms={rooms}
         onClose={() => setBookingToEdit(null)}
         onSuccess={() => {
           fetchBookings();
           setBookingToEdit(null);
           showToast('Peminjaman berhasil diperbarui', 'success');
         }}
       />
     )}
   </DashboardLayout>
 );
}