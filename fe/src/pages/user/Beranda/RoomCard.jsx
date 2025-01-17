import {  Users, MapPin } from 'lucide-react';

const RoomCard = ({ room, onBookClick }) => (
  <div 
    onClick={() => onBookClick(room)}
    className="flex items-center gap-4 bg-white rounded-lg border border-gray-100 p-2 hover:shadow-md transition-shadow cursor-pointer"
  >
    <img 
      src={`${import.meta.env.VITE_API_URL}${room.foto_ruangan}`} 
      alt={room.nama_ruangan} 
      className="w-24 h-24 object-cover rounded-md flex-shrink-0"
    />
    <div className="flex-grow min-w-0">
      <h3 className="text-base font-medium text-gray-800 mb-1">{room.nama_ruangan}</h3>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{room.kapasitas}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <span className="truncate">{room.lokasi}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{room.deskripsi}</p>
    </div>
  </div>
);

export default RoomCard