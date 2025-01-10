import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoomPopup = ({ rooms, isOpen, onClose, loading }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleRoomClick = (roomId) => {
    navigate(`/peminjaman/${roomId}`);
    onClose();
  };

  return (
    <div 
      className="absolute right-0 left-0 top-full bg-white shadow-xl rounded-lg py-2 mt-2 border border-gray-100 mx-auto w-56"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
        <div className="w-3 h-3 bg-white rotate-45 transform origin-center shadow-lg" />
      </div>
      <div className="relative">
        {loading ? (
          <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
        ) : (
          rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => handleRoomClick(room.id)}
              className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors duration-200 text-gray-700 hover:text-primary"
            >
              {room.nama_ruangan}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default RoomPopup;