export const BookingCard = ({ booking, onClick }) => {
    const statusColor = booking.status === 'DISETUJUI' ? 'bg-green-500' :"SELESAI"?"bg-gray-400": 'bg-yellow-400';
  
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick(booking);
        }}
        className={`w-full text-left text-xs p-2 mb-1 rounded cursor-pointer 
          transition-colors hover:opacity-80 ${statusColor}`}
      >
        <div className="font-medium truncate">{booking.nama_kegiatan}</div>
        <div className="truncate">{booking.jam_mulai} - {booking.jam_selesai}</div>
      </button>
    );
  };