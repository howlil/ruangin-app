import MainLayout from "@/components/layout/MainLayout";
import { CalendarHeader } from './CalendarHeader';
import { StatusLegend } from './StatusLegend';
import { DayCell } from './DayCell';
import { BookingDetailModal } from './BookingDetailModal';
import { useBookingCalendar } from "@/hooks/apis/useBookingCalendar";
import api from "@/utils/api";
import { startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, startOfDay, format, isBefore, isSameMonth, isToday, startOfWeek, endOfWeek } from 'date-fns';


export default function RoomBookingCalendar() {
  const {
    currentDate,
    setCurrentDate,
    loading,
    selectedBooking,
    setSelectedBooking,
    bookingsByDate
  } = useBookingCalendar(api);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const today = startOfDay(new Date());

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

                return (
                  <div
                    key={dateStr}
                    className={`relative p-2 min-h-[8rem] transition-all duration-200 
                      ${!isSameMonth(day, currentDate) ? 'bg-gray-50 opacity-50' : ''} 
                      ${isPastDate ? 'bg-gray-100' : ''} 
                      ${isToday(day) ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset' : ''}`}
                  >
                    <div className={`text-sm mb-2 ${isToday(day) ? 'text-blue-600 font-semibold' : 'text-gray-500'
                      }`}>
                      {format(day, 'd')}
                    </div>

                    {/* <DayCell
                      dateStr={dateStr}
                      bookings={bookings}
                      isPastDate={isPastDate}
                      onBookingClick={setSelectedBooking}
                      isExpanded={expandedCells[dateStr]}
                      onToggleExpand={(dateStr) =>
                        setExpandedCells(prev => ({
                          ...prev,
                          [dateStr]: !prev[dateStr]
                        }))
                      }
                    /> */}
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