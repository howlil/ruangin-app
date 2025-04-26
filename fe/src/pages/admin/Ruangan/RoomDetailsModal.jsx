import { Dialog } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/utils/date";

export default function RoomDetailsModal({ room, onClose }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'DISETUJUI':
        return 'success';
      case 'DITOLAK':
        return 'danger';
      case 'DIPROSES':
        return 'warning';
      default:
        return 'default';
    }
  };

  const sortedBookings = [...room.peminjaman].sort((a, b) =>
    new Date(a.tanggal) - new Date(b.tanggal)
  );


  const groupedBookings = sortedBookings.reduce((acc, booking) => {
    const date = new Date(booking.tanggal_mulai);
    const monthYear = date.toLocaleString('id-ID', {
      month: 'long',
      year: 'numeric'
    });

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(booking);
    return acc;
  }, {});

  return (
    <Dialog
      open={true}
      onClose={onClose}
      title={room.nama_ruangan}
      size="lg"
    >
      <div className="space-y-6">
        <div className="aspect-w-16 aspect-h-9  rounded-lg">
          {room.foto_ruangan ? (
            <img
              src={room.foto_ruangan ? `${import.meta.env.VITE_API_URL}${room.foto_ruangan}` : '/placeholder-room.jpg'}
              alt={room.nama_ruangan}
              className="object-cover rounded-lg"
            />
          ) : (
            <div className="flex items-center justify-center text-gray-400">
              Tidak ada foto
            </div>
          )}
        </div>

        {/* Room Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Lokasi</h3>
            <p className="mt-1">{room.lokasi_ruangan}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Kapasitas</h3>
            <p className="mt-1">{room.kapasitas}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Deskripsi</h3>
            <p className="mt-1">{room.deskripsi || 'Tidak ada deskripsi'}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Daftar Peminjaman</h3>
          {Object.entries(groupedBookings).map(([monthYear, bookings]) => (
            <div key={monthYear} className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">
                {monthYear}
              </h4>
              <div className="space-y-3">
                {bookings.map(booking => (
                  <div
                    key={booking.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{booking.nama_kegiatan}</h5>
                        <p className="text-sm text-gray-500">
                          {booking.Pengguna.nama_lengkap} ({booking.Pengguna.email})
                        </p>
                      </div>
                      <Badge variant={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="mb-1">
                        Tanggal: {formatDate(booking.tanggal_mulai)} 
                      </p>
                      <p>
                        Waktu: {booking.jam_mulai} - {booking.jam_selesai}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {sortedBookings.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Belum ada peminjaman
            </p>
          )}
        </div>
      </div>
    </Dialog>
  );
}
