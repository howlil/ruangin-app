import React, { useState, useEffect } from 'react';
import api from '@/utils/api';

const DisplayTimeline = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate hours array from 7 to 17 with proper formatting
  const hours = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 7;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/v1/display');
        if (response.data) {
          setBookings(response.data.data);
        } else {
          throw new Error(response.data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const calculatePosition = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startDecimal = startHour + startMinute / 60;
    const endDecimal = endHour + endMinute / 60;
    
    const startPosition = ((startDecimal - 7) / 10) * 100;
    const width = ((endDecimal - startDecimal) / 10) * 100;
    
    return { left: `${startPosition}%`, width: `${width}%` };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">Error: {error}</div>
    );
  }

  return (
    <div className="p-8 max-w-8xl mx-auto bg-white">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Jadwal Ruangan - {new Date().toLocaleDateString('id-ID', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}
      </h1>

      <div className="relative">
        {/* Timeline Header */}
        <div className="flex border-b mb-6">
          <div className="w-40 flex-shrink-0" /> {/* Space for room names */}
          <div className="flex-1 grid grid-cols-11">
            {hours.map(hour => (
              <div 
                key={hour}
                className="text-sm text-gray-600 font-medium text-center"
              >
                {hour}
              </div>
            ))}
          </div>
        </div>

        {/* Rooms and Bookings */}
        <div className="space-y-6">
          {bookings.map((room) => (
            <div key={room.ruang_rapat} className="flex items-center">
              <div className="w-40 flex-shrink-0">
                <span className="text-sm font-medium text-gray-700">
                  {room.ruang_rapat}
                </span>
              </div>
              
              <div className="flex-1 relative h-16">
                {/* Background grid */}
                <div className="absolute inset-0 grid grid-cols-11 gap-px">
                  {Array(11).fill(0).map((_, i) => (
                    <div key={i} className="bg-gray-50" />
                  ))}
                </div>
                
                {/* Bookings */}
                {room.jadwal.map((booking, idx) => {
                  const position = calculatePosition(
                    booking.jam_mulai, 
                    booking.jam_selesai
                  );
                  
                  return (
                    <div
                      key={idx}
                      className="absolute top-1 bottom-1 rounded-lg bg-blue-500 shadow-sm transition-all hover:bg-blue-600"
                      style={position}
                    >
                      <div className="p-2 h-full flex flex-col justify-center">
                        <div className="text-sm text-white font-medium truncate">
                          {booking.nama_kegiatan}
                        </div>
                        <div className="text-xs text-white/90">
                          {booking.jam_mulai} - {booking.jam_selesai}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayTimeline;