import React, { useState, useEffect, useRef } from 'react';
import { format, addHours } from 'date-fns';
import { id } from 'date-fns/locale';
import api from '@/utils/api';
import Logo from '@/components/general/Navbar/Logo';

const BUSINESS_HOURS = {
  start: 7,
  end: 18,
};

const SCROLL_SPEED = 1;
const SCROLL_PAUSE_DURATION = 3000;

const DisplayTimeline = () => {
  const [bookings, setBookings] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const timeSlots = Array.from(
    { length: BUSINESS_HOURS.end - BUSINESS_HOURS.start },
    (_, i) => `${String(i + BUSINESS_HOURS.start).padStart(2, '0')}:00`
  );

  // Auto scroll logic remains the same
  useEffect(() => {
    if (!containerRef.current || loading) return;

    let lastTimestamp = 0;
    let pauseUntil = 0;
    let scrollingUp = false;

    const animate = (timestamp) => {
      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
      }

      const container = containerRef.current;
      const maxScroll = container.scrollHeight - container.clientHeight;

      if (timestamp < pauseUntil) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (scrollingUp) {
        container.scrollTop -= SCROLL_SPEED;
        if (container.scrollTop <= 0) {
          scrollingUp = false;
          pauseUntil = timestamp + SCROLL_PAUSE_DURATION;
        }
      } else {
        container.scrollTop += SCROLL_SPEED;
        if (container.scrollTop >= maxScroll) {
          scrollingUp = true;
          pauseUntil = timestamp + SCROLL_PAUSE_DURATION;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [loading]);

  // Other useEffect hooks remain the same
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/v1/display');
        if (response.data) {
          setBookings(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    const interval = setInterval(fetchBookings, 60000);
    return () => clearInterval(interval);
  }, []);

  const calculatePosition = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const adjustedHours = hours - BUSINESS_HOURS.start;
    return (adjustedHours + minutes / 60) * 60;
  };

  const calculateHeight = (startTime, endTime) => {
    const startMinutes = calculatePosition(startTime);
    const endMinutes = calculatePosition(endTime);
    return endMinutes - startMinutes;
  };

  const isUpcoming = (startTime) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const bookingTime = new Date().setHours(hours, minutes, 0, 0);
    const currentTimePlus1Hour = addHours(currentTime, 1).getTime();
    const currentTimeValue = currentTime.getTime();

    return bookingTime > currentTimeValue && bookingTime <= currentTimePlus1Hour;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
          <p className="text-gray-600 font-medium">Loading schedule...</p>
        </div>
      </div>
    );
  }

  const formattedTime = format(currentTime, 'HH:mm', { locale: id });
  const formattedDate = format(currentTime, 'EEEE, dd MMMM yyyy', { locale: id });

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <Logo />
              <p className="text-sm text-gray-600 font-medium">{formattedDate}</p>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              {formattedTime}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 h-full">
          <div className="bg-white shadow-lg rounded-xl h-full border border-gray-200 backdrop-blur-sm bg-opacity-90">
            <div
              ref={containerRef}
              className="flex overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              style={{ height: 'calc(100vh - 180px)' }}
            >
              <div className="flex min-w-full">
                {/* Time Axis */}
                <div className="w-20 flex-shrink-0 border-r border-gray-200 bg-gray-50 bg-opacity-50">
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className="h-16 text-xs font-medium text-gray-500 relative border-b border-gray-100 last:border-b-0 flex items-center justify-center"
                    >
                      <span className="text-gray-600">
                        {time}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 relative">
                  <div className="flex">
                    {bookings.map((room) => (
                      <div
                        key={room.ruang_rapat}
                        className="w-48 border-l border-gray-100 relative first:border-l-0"
                      >
                        <div className="relative" style={{ height: `${(BUSINESS_HOURS.end - BUSINESS_HOURS.start) * 60}px` }}>
                          {room.jadwal.map((booking, idx) => {
                            const top = calculatePosition(booking.jam_mulai);
                            const height = calculateHeight(booking.jam_mulai, booking.jam_selesai);
                            const upcoming = isUpcoming(booking.jam_mulai);

                            if (top >= 0 && top <= (BUSINESS_HOURS.end - BUSINESS_HOURS.start) * 60) {
                              return (
                                <div
                                  key={idx}
                                  className={`absolute inset-x-0 mx-2 rounded-lg p-3 transition-all 
                                    hover:shadow-lg hover:z-20 group cursor-pointer relative overflow-hidden
                                    ${upcoming
                                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 hover:from-yellow-100 hover:to-orange-100'
                                      : 'bg-gradient-to-r from-white to-gray-50 border-l-4 border-blue-400 hover:from-blue-50 hover:to-gray-50'
                                    }`}
                                  style={{
                                    top: `${top}px`,
                                    height: `${height}px`,
                                    minHeight: '48px',
                                    boxShadow: upcoming ? '0 4px 6px -1px rgba(251, 191, 36, 0.1), 0 2px 4px -1px rgba(251, 191, 36, 0.06)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                  }}
                                >
                                  <div className="flex flex-col h-full relative z-10">
                                    <div className="space-y-2">
                                      <div className="text-sm font-semibold text-gray-900 truncate">
                                        {booking.nama_kegiatan}
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span className={`w-2 h-2 rounded-full ${upcoming ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                                        <span className="text-xs text-gray-600 font-medium">
                                          {room.ruang_rapat} - {booking.tim_kerja.code || 'TK-001'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  {upcoming && (
                                    <div className="absolute inset-0 z-0">
                                      <div className="absolute inset-0 bg-yellow-200 opacity-20 animate-pulse"></div>
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    ))}

                    {/* Current time indicator */}
                    {currentTime.getHours() >= BUSINESS_HOURS.start &&
                      currentTime.getHours() <= BUSINESS_HOURS.end && (
                        <div
                          className="absolute left-0 right-0 border-t-2 border-red-400 z-30"
                          style={{
                            top: `${calculatePosition(format(currentTime, 'HH:mm'))}px`,
                          }}
                        >
                          <div className="w-3 h-3 bg-red-400 rounded-full -mt-1.5 -ml-1.5 animate-pulse" />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayTimeline;