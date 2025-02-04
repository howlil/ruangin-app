import MainLayout from "@/components/layout/MainLayout";
import { CalendarHeader } from './CalendarHeader';
import { StatusLegend } from './StatusLegend';
import { DayCell } from './DayCell';
import { BookingDetailModal } from './BookingDetailModal';
import { useBookingCalendar } from "@/hooks/apis/useBookingCalendar";
import api from "@/utils/api";
import axios from "axios";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  startOfDay,
  format,
  isBefore,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
  isWeekend
} from 'date-fns';
import React from "react";
import { HandleResponse } from "@/components/ui/HandleResponse";
import HolidayCard from "./HolidayCard";

export default function RoomBookingCalendar() {
  const {
    currentDate,
    setCurrentDate,
    loading,
    selectedBooking,
    setSelectedBooking,
    bookingsByDate
  } = useBookingCalendar(api);

  const [holidays, setHolidays] = React.useState([]);

  React.useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_DAY_OFF}`);
        setHolidays(data);
      } catch (error) {
        HandleResponse({ error });
      }
    };
    fetchHolidays();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const today = startOfDay(new Date());

  const isHoliday = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return holidays.some(holiday => holiday.tanggal === dateStr);
  };

  const getHolidayInfo = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return holidays.find(holiday => holiday.tanggal === dateStr);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-8 md:py-20">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={() => setCurrentDate(subMonths(currentDate, 1))}
          onNextMonth={() => setCurrentDate(addMonths(currentDate, 1))}
        />

        <StatusLegend />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-7 border-b">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 border-b divide-x">
              {calendarDays.map((day, index) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const bookings = bookingsByDate[dateStr] || [];
                const isPastDate = isBefore(day, today);
                const isWeekendDay = isWeekend(day);
                const holiday = getHolidayInfo(day);
                const isDateHoliday = isHoliday(day);

                return (
                  <div
                    key={dateStr}
                    className={`relative p-2 min-h-[8rem] transition-all duration-200 
                      ${!isSameMonth(day, currentDate) ? 'bg-gray-50 opacity-50' : ''} 
                      ${isPastDate ? 'bg-gray-100' : ''} 
                      ${isToday(day) ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset' : ''}
                      ${isDateHoliday ? 'bg-red-50' : ''}`}
                  >
                    <div
                      className={`text-sm font-medium
                        ${isToday(day) ? 'text-blue-600' : ''}
                        ${isWeekendDay || isDateHoliday ? 'text-red-600' : 'text-gray-500'}`}
                    >
                      {format(day, 'd')}
                    </div>

                    {holiday && <HolidayCard holiday={holiday} />}
                    <DayCell
                      bookings={bookings}
                      onBookingClick={setSelectedBooking}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <BookingDetailModal
          open={!!selectedBooking}
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      </div>
    </MainLayout>
  );
}