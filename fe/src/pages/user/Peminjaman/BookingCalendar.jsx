// src/components/BookingCalendar.jsx
import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

const CustomPickersDay = (props) => {
  const { day, selectedDay, bookings, ...other } = props;

  const getBookingStatusForDate = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    const bookingsOnDate = bookings?.filter(
      booking => dayjs(booking.tanggal).format('YYYY-MM-DD') === formattedDate
    ) || [];
    
    if (bookingsOnDate.length === 0) return 'available';
    if (bookingsOnDate.some(b => b.status === 'DISETUJUI')) return 'approved';
    return 'pending';
  };

  const status = getBookingStatusForDate(day);
  const isSelected = selectedDay?.isSame(day, 'day');

  return (
    <div className="relative">
      <PickersDay
        {...other}
        day={day}
        selected={isSelected}
        sx={{
          width: '40px',
          height: '40px',
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
            backgroundColor: '#2563EB !important',
            color: 'white !important',
          },
        }}
      />
      {(status === 'approved' || status === 'pending') && (
        <div
          className={`absolute w-full h-full rounded-full -z-10 top-0 left-0 ${
            status === 'approved' ? 'bg-green-500' : 'bg-orange-400'
          }`}
        />
      )}
    </div>
  );
};

const BookingCalendar = ({ selectedDate, onDateSelect, bookings }) => {
  const handleDateChange = (newDate) => {
    if (onDateSelect) {
      onDateSelect(newDate);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
        <DateCalendar 
          sx={{}}
          value={selectedDate}
          onChange={handleDateChange}
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