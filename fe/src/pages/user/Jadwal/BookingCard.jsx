import React from 'react';

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
      className={`w-full text-left text-xs py-1.5 px-2.5 mb-1 rounded-md cursor-pointer
        transition-all duration-150 hover:brightness-95 active:brightness-90 
        ${statusColor} text-black`}
    >
      <div className="space-y-0.5">
        <div className="font-medium leading-tight">
          {booking.room.nama_ruangan}
        </div>
        <div className="leading-3 line-clamp-2">
          {booking.nama_kegiatan}
        </div>
        <div className="text-[11px] opacity-90">
          {booking.jam_mulai} - {booking.jam_selesai}
        </div>
      </div>
    </button>
  );
};

export default BookingCard; 