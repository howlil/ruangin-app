import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);
dayjs.locale('id');

const CustomPickersDay = (props) => {
  const { day, selectedDay, bookings, ...other } = props;
  const isToday = day.isSame(dayjs(), 'day');

  const getBookingStatusForDate = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    const bookingsOnDate = bookings?.filter(booking => {
      const startDate = dayjs(booking.tanggal_mulai);
      const endDate = booking.tanggal_selesai ? dayjs(booking.tanggal_selesai) : startDate;
      return date.isBetween(startDate, endDate, 'day', '[]');
    }) || [];

    if (bookingsOnDate.length === 0) return 'available';
    if (bookingsOnDate.some(b => b.status === 'DISETUJUI')) return 'approved';
    if (bookingsOnDate.some(b => b.status === 'DIPROSES')) return 'pending';
    return 'available';
  };

  const status = getBookingStatusForDate(day);
  const isSelected = selectedDay?.isSame(day, 'day');

  // Define styles based on combinations of states
  const getStyles = () => {
    const baseStyles = {
      width: '40px',
      height: '40px',
      position: 'relative',
    };

    // Today's specific styles
    if (isToday) {
      return {
        ...baseStyles,
        '&:not(.Mui-selected)': {
          borderRadius: '50%',
          border: '2px solid #3B82F6',
          ...(status === 'approved' && {
            backgroundColor: '#22C55E !important',
            color: 'white !important',
            borderColor: '#22C55E',
          }),
          ...(status === 'pending' && {
            backgroundColor: '#FB923C !important',
            color: 'white !important',
            borderColor: '#FB923C',
          }),
        },
        '&.Mui-selected': {
          border: '2px solid #2563EB !important',
          backgroundColor: 'white !important',
          color: 'black !important',
        },
      };
    }

    // Regular day styles
    return {
      ...baseStyles,
      '&:not(.Mui-selected)': {
        borderRadius: '50%',
        ...(status === 'approved' && {
          backgroundColor: '#22C55E !important',
          color: 'white !important',
        }),
        ...(status === 'pending' && {
          backgroundColor: '#FB923C !important',
          color: 'white !important',
        }),
      },
      '&.Mui-selected': {
        border: '2px solid #2563EB !important',
        backgroundColor: 'white !important',
        color: 'black !important',
      },
    };
  };

  return (
    <div className="relative">
      <PickersDay
        {...other}
        day={day}
        selected={isSelected}
        sx={getStyles()}
      />
      {/* Status indicator dots for today with booking */}
      {isToday && (status === 'approved' || status === 'pending') && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <div className={`w-1.5 h-1.5 rounded-full ${
            status === 'approved' ? 'bg-green-500' : 'bg-orange-400'
          }`} />
        </div>
      )}
    </div>
  );
};

const BookingCalendar = ({ selectedDate, onDateSelect, bookings }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
        <DateCalendar
          value={selectedDate}
          onChange={onDateSelect}
          slots={{
            day: (props) => (
              <CustomPickersDay
                {...props}
                bookings={bookings}
                selectedDay={selectedDate}
              />
            )
          }}
          disablePast
        />
      </LocalizationProvider>

      <div className="px-6 pb-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-blue-500"></div>
          <span className="text-sm text-gray-600">Hari ini</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">Ruangan sudah disetujui oleh admin</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-400"></div>
          <span className="text-sm text-gray-600">Ruangan sedang diproses oleh admin</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;