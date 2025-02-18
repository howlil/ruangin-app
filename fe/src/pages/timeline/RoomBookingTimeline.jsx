import React, { useMemo } from 'react';
import { Clock, MapPin, Users } from 'lucide-react';
import AnimatedListTimeline from './animate-list-timeline';
import { motion } from 'framer-motion';

const TimelineCard = ({ booking, roomName }) => {
  // Check if meeting is currently active
  const isActive = useMemo(() => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMinute] = booking.jam_mulai.split(':').map(Number);
    const [endHour, endMinute] = booking.jam_selesai.split(':').map(Number);
    
    const meetingStart = startHour * 60 + startMinute;
    const meetingEnd = endHour * 60 + endMinute;
    
    return currentTime >= meetingStart && currentTime <= meetingEnd;
  }, [booking.jam_mulai, booking.jam_selesai]);

  const pulseAnimation = {
    scale: [1, 1.02, 1],
    boxShadow: [
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    ]
  };

  return (
    <motion.div 
      className={`w-full bg-white rounded-xl shadow-lg transition-colors duration-300
        ${isActive ? 'border-2 border-blue-500 bg-blue-50/30' : ''}`}
      animate={isActive ? pulseAnimation : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="flex items-center p-4 gap-4">
        {/* Time Section */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center
            ${isActive ? 'bg-blue-500' : 'bg-blue-50'}`}>
            <Clock className={`h-6 w-6 ${isActive ? 'text-white' : 'text-blue-500'}`} />
          </div>
          <div className="flex flex-col">
            <span className={`text-xl font-bold ${isActive ? 'text-blue-600' : 'text-blue-500'}`}>
              {booking.jam_mulai}
            </span>
            <span className="text-xs text-gray-500">sampai {booking.jam_selesai}</span>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-12 w-px bg-gray-200"></div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
              {booking.nama_kegiatan}
            </h3>
            {isActive && (
              <span className="flex-shrink-0 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full animate-pulse">
                Sedang Berlangsung
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <div className={`flex items-center px-2 py-1 rounded-full
              ${isActive ? 'bg-blue-100' : 'bg-blue-50'}`}>
              <MapPin className="h-3.5 w-3.5 mr-1 text-blue-500" />
              <span className="text-sm font-medium text-blue-500">{roomName}</span>
            </div>
            <div className={`flex items-center px-2 py-1 rounded-full
              ${isActive ? 'bg-blue-100' : 'bg-blue-50'}`}>
              <Users className="h-3.5 w-3.5 mr-1 text-blue-500" />
              <span className="text-sm font-medium text-blue-500">
                Tim {booking.tim_kerja.code}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Rest of the components remain the same
const StaticTimeline = ({ bookings }) => {
  return (
    <div className="space-y-3">
      {bookings.slice(0, 4).map((booking, idx) => (
        <TimelineCard
          key={`${booking.roomName}-${idx}`}
          booking={booking}
          roomName={booking.roomName}
        />
      ))}
    </div>
  );
};

const RoomBookingTimeline = ({ schedules }) => {
  const allBookings = useMemo(() =>
    schedules.flatMap(room =>
      room.jadwal.map(booking => ({
        ...booking,
        roomName: room.ruang_rapat
      }))
    ).sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai)),
    [schedules]
  );

  const shouldAnimate = allBookings.length > 4;

  return (
    <div className="w-full max-h-screen overflow-hidden mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Agenda Rapat</h2>
        <div className="text-sm text-gray-500">
          {allBookings.length} agenda hari ini
        </div>
      </div>

      {shouldAnimate ? (
        <AnimatedListTimeline delay={3000}>
          {allBookings.map((booking, idx) => (
            <TimelineCard
              key={`${booking.roomName}-${idx}`}
              booking={booking}
              roomName={booking.roomName}
            />
          ))}
        </AnimatedListTimeline>
      ) : (
        <StaticTimeline bookings={allBookings} />
      )}
    </div>
  );
};

export default RoomBookingTimeline;