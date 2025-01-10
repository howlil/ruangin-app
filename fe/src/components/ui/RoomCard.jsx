import React from 'react';
import { MapPin, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 h-[500px] flex flex-col">
      <div className="relative h-64 overflow-hidden shrink-0">
        <img
          src={`${import.meta.env.VITE_API_URL}${room.foto_ruangan}`}
          alt={room.nama_ruangan}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{room.nama_ruangan}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{room.deskripsi}</p>

          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="line-clamp-1">{room.lokasi_ruangan}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4 shrink-0" />
              <span>Kapasitas {room.kapasitas} Orang</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Button 
            className="w-full"
            onClick={() => navigate(`/peminjaman/${room.id}`)}
          >
            Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;