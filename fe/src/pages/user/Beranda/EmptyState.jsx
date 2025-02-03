import React from 'react';
import { DoorClosed, Calendar, Search } from 'lucide-react';

const EmptyState = () => {
  const icons = [
    { icon: DoorClosed, delay: '0' },
    { icon: Calendar, delay: '150' },
    { icon: Search, delay: '300' }
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex items-center justify-center gap-4 mb-6">
        {icons.map(({ icon: Icon, delay }, index) => (
          <div
            key={index}
            className="animate-bounce"
            style={{
              animationDelay: `${delay}ms`,
              animationDuration: '2s'
            }}
          >
            <Icon 
              size={32}
              className="text-gray-400 transform transition-all hover:scale-110 hover:text-blue-500"
            />
          </div>
        ))}
      </div>

      {/* Circular Background with Pulse Effect */}
      <div className="relative">
        <div className="absolute inset-0 animate-ping bg-blue-100 rounded-full opacity-25" />
        <div className="relative bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg text-center font-medium text-gray-900 mb-2">
            Tidak peminjaman ruangan hari ini
          </h3>
          <p className="text-gray-500 text-center max-w-sm">
            Saat ini semua ruangan sedang kosong. Silakan lakukan Peminjaman.
          </p>
        </div>
      </div>

      
    </div>
  );
};

export default EmptyState;