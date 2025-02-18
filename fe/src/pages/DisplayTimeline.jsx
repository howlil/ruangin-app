import React, { useState, useEffect, useRef } from 'react';
import { format, addHours } from 'date-fns';
import { id } from 'date-fns/locale';
import api from '@/utils/api';
import Logo from '@/components/general/Navbar/Logo';
import RoomBookingTimeline from './timeline/RoomBookingTimeline';



const DisplayTimeline = () => {
  const [bookings, setBookings] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);




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

  }, []);



  // Loading state remains the same
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

      <RoomBookingTimeline schedules={bookings}/>
    </div>
  );
};

export default DisplayTimeline;