// src/components/RoomDetail.jsx
import React from 'react';
import { MapPin, UsersRound, Building2, LayoutDashboard } from 'lucide-react';

export const RoomDetail = ({ room }) => {
  const [building, floor] = room.lokasi_ruangan?.split(' Lantai ') || [room.lokasi_ruangan, ''];

  const features = [
    {
      icon: Building2,
      label: 'Gedung',
      value: building
    },
    {
      icon: LayoutDashboard,
      label: 'Lantai',
      value: floor || '-'
    },
    {
      icon: UsersRound,
      label: 'Kapasitas',
      value: `${room.kapasitas} Orang`
    },
    {
      icon: MapPin,
      label: 'Lokasi',
      value: room.lokasi_ruangan
    }
  ];

  return (
    <div>
      <div className="relative mb-8 rounded-xl overflow-hidden group">
        <img
          src={`${import.meta.env.VITE_API_URL}${room.foto_ruangan}`}
          alt={room.nama_ruangan}
          className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{room.nama_ruangan}</h1>
          <p className="text-white/80 line-clamp-2">{room.deskripsi}</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/5 rounded-lg">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{feature.label}</p>
                <p className="font-medium text-gray-900">{feature.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-100">
        <h2 className="text-lg font-semibold mb-3">Tentang Ruangan</h2>
        <p className="text-gray-600 leading-relaxed">
          {room.deskripsi}
        </p>
      </div>
    </div>
  );
};

export default RoomDetail;