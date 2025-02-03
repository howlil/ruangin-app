export const BookingCard = ({ booking, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'DISETUJUI':
        return 'bg-green-500';
      case 'SELESAI':
        return 'bg-gray-400';
      case 'DIPROSES':
        return 'bg-yellow-400';
      default:
        return 'bg-gray-300';
    }
  };

  const statusColor = getStatusColor(booking.status);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(booking);
      }}
      className={`w-full text-left text-xs p-2 mb-1 rounded cursor-pointer 
        transition-colors hover:opacity-80 ${statusColor} text-black`}
    >
      <div className="font-medium truncate">{booking.nama_kegiatan}</div>
      <div className="truncate">{booking.jam_mulai} - {booking.jam_selesai}</div>
    </button>
  );
};