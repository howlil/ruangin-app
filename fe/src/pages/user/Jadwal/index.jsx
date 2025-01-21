import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  parseISO,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  isBefore,
  startOfDay
} from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar, ChevronDown } from 'lucide-react';
import MainLayout from "@/components/layout/MainLayout";
import api from "@/utils/api";
import { Dialog } from '@headlessui/react';
import { HandleResponse } from '@/components/ui/HandleResponse';

const colorPalette = [
  { bg: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-800' },
  { bg: 'bg-green-100', border: 'border-green-200', text: 'text-green-800' },
  { bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-800' },
  { bg: 'bg-orange-100', border: 'border-orange-200', text: 'text-orange-800' },
  { bg: 'bg-pink-100', border: 'border-pink-200', text: 'text-pink-800' },
  { bg: 'bg-yellow-100', border: 'border-yellow-200', text: 'text-yellow-800' },
  { bg: 'bg-teal-100', border: 'border-teal-200', text: 'text-teal-800' },
  { bg: 'bg-red-100', border: 'border-red-200', text: 'text-red-800' }
];

export default function RoomCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [colorMap, setColorMap] = useState({});
  const [expandedCells, setExpandedCells] = useState({});
  const [rowHeights, setRowHeights] = useState([]);

  const generateColorMap = (roomsData) => {
    const uniqueRooms = [...new Set(roomsData.map(room => room.nama_ruangan.toLowerCase()))];
    const newColorMap = {};

    uniqueRooms.forEach((roomName, index) => {
      const colorIndex = index % colorPalette.length;
      const colors = colorPalette[colorIndex];

      newColorMap[roomName] = {
        class: `${colors.bg} ${colors.border} ${colors.text}`,
        label: roomName.split(' ').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      };
    });

    newColorMap.default = {
      class: 'bg-gray-100 border-gray-200 text-gray-800',
      label: 'Ruangan Lainnya'
    };

    return newColorMap;
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await api.get('/v1/ruang-rapat', {
          params: {
            month: format(currentDate, 'yyyy-MM')
          }
        });
        const roomsData = response.data.data;
        setRooms(roomsData);
        setColorMap(generateColorMap(roomsData));
      } catch (error) {
        HandleResponse({ error });
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [currentDate]);

  const RoomLegend = () => (
    <div className="mb-4 flex flex-wrap gap-4">
      {Object.entries(colorMap).map(([key, value]) => (
        key !== 'default' && (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${value.class.split(' ')[0]}`} />
            <span className="text-sm text-gray-600">{value.label}</span>
          </div>
        )
      ))}
    </div>
  );

  const StatusLegend = () => {
    const statuses = [
      { label: 'Disetujui', color: 'border-l-green-500 bg-green-500' },
      { label: 'Diproses', color: 'border-l-orange-400 bg-orange-400' }
    ];

    return (
      <div className="flex items-center gap-4 mb-4">
        {statuses.map(status => (
          <div key={status.label} className="flex items-center gap-2">
            <div className={`h-4 w-4 border rounded border-l-2 ${status.color}`} />
            <span className="text-sm text-gray-600">{status.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const BookingCard = ({ booking }) => {
    const roomType = booking.room.nama_ruangan.toLowerCase();
    const colorStyle = colorMap[roomType] || colorMap.default;
    const statusColor = booking.status === 'DISETUJUI' ? 'border-l-green-500' : 'border-l-orange-400';

    const handleCardClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedBooking(booking);
    };

    return (
      <button
        onClick={handleCardClick}
        className={`w-full text-left text-xs p-2 mb-1 rounded border border-l-4 cursor-pointer 
          transition-colors hover:opacity-80 ${colorStyle.class} ${statusColor}`}
      >
        <div className="font-medium truncate">{booking.nama_kegiatan}</div>
        <div className="truncate">{booking.jam_mulai} - {booking.jam_selesai}</div>
      </button>
    );
  };

  const DayCell = ({ dateStr, bookings, isPastDate }) => {
    const cellRef = React.useRef(null);
    const rowIndexRef = React.useRef(null);
    const MAX_VISIBLE_BOOKINGS = 2;
    const isExpanded = expandedCells[dateStr] || false;
    const visibleBookings = isExpanded ? bookings : bookings.slice(0, MAX_VISIBLE_BOOKINGS);
    const hasMoreBookings = bookings.length > MAX_VISIBLE_BOOKINGS;

    useEffect(() => {
      const updateRowHeight = () => {
        if (!cellRef.current) return;
        
        // Only calculate rowIndex once and store it
        if (rowIndexRef.current === null) {
          rowIndexRef.current = Math.floor(
            [...cellRef.current.parentElement.children].indexOf(cellRef.current) / 7
          );
        }
        
        const height = cellRef.current.scrollHeight;
        const rowIndex = rowIndexRef.current;
        
        setRowHeights(prev => {
          if (prev[rowIndex] === height) return prev; // Skip update if height hasn't changed
          const newHeights = [...prev];
          newHeights[rowIndex] = Math.max(newHeights[rowIndex] || 0, height);
          return newHeights;
        });
      };

      requestAnimationFrame(updateRowHeight);
    }, [bookings.length, isExpanded]); 

    if (!bookings.length || isPastDate) return null;

    const handleSeeMore = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setExpandedCells(prev => ({
        ...prev,
        [dateStr]: !prev[dateStr]
      }));
    };

    return (
      <div ref={cellRef} className="space-y-1 h-full">
        {visibleBookings.map((booking, idx) => (
          <BookingCard key={`${booking.id}-${idx}`} booking={booking} />
        ))}
        
        {hasMoreBookings && !isExpanded && (
          <button
            onClick={handleSeeMore}
            className="w-full text-xs text-blue-600 hover:text-blue-800 
              flex items-center justify-center gap-1 py-1 hover:bg-blue-50 rounded"
          >
            <span>Lihat {bookings.length - MAX_VISIBLE_BOOKINGS} lainnya</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        )}
        
        {isExpanded && hasMoreBookings && (
          <button
            onClick={handleSeeMore}
            className="w-full text-xs text-blue-600 hover:text-blue-800 
              flex items-center justify-center gap-1 py-1 hover:bg-blue-50 rounded"
          >
            <span>Sembunyikan</span>
            <ChevronDown className="w-3 h-3 transform rotate-180" />
          </button>
        )}
      </div>
    );
  };

  // Group bookings by date considering date ranges
  const bookingsByDate = rooms.reduce((acc, room) => {
    room.peminjaman.forEach(booking => {
      if (booking.status === 'DISETUJUI' || booking.status === 'DIPROSES') {
        const startDate = parseISO(booking.tanggal_mulai);
        const endDate = booking.tanggal_selesai ? parseISO(booking.tanggal_selesai) : startDate;

        const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

        dateRange.forEach(date => {
          const dateStr = format(date, 'yyyy-MM-dd');
          if (!acc[dateStr]) {
            acc[dateStr] = [];
          }
          acc[dateStr].push({
            ...booking,
            room: {
              nama_ruangan: room.nama_ruangan,
              lokasi_ruangan: room.lokasi_ruangan,
              foto_ruangan: room.foto_ruangan,
              kapasitas: room.kapasitas,
              deskripsi: room.deskripsi
            }
          });
        });
      }
    });
    return acc;
  }, {});

  const getDateClasses = (day, rowIndex) => {
    const baseClasses = "relative p-2 transition-all duration-200";
    const isCurrentMonth = isSameMonth(day, currentDate);
    const isPastDate = isBefore(day, today);
    const isCurrentDate = isToday(day);
    const minHeight = rowHeights[rowIndex] ? `${rowHeights[rowIndex]}px` : 'min-h-32';

    let classes = [baseClasses];

    if (!isCurrentMonth) {
      classes.push('bg-gray-50 opacity-50');
    }
    if (isPastDate) {
      classes.push('bg-gray-100 cursor-not-allowed');
    }
    if (isCurrentDate) {
      classes.push('bg-blue-50 ring-2 ring-blue-500 ring-inset');
    }

    return `${classes.join(' ')} ${minHeight}`;
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const today = startOfDay(new Date());

  const BookingDetailModal = ({ booking, onClose }) => {
    if (!booking) return null;

    return (
      <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">{booking.nama_kegiatan}</h3>
            <p className="text-sm text-gray-600">{booking.room.nama_ruangan}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(parseISO(booking.tanggal_mulai), 'd MMMM yyyy', { locale: id })}
                  {booking.tanggal_selesai && (
                    ` - ${format(parseISO(booking.tanggal_selesai), 'd MMMM yyyy', { locale: id })}`
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{booking.jam_mulai} - {booking.jam_selesai}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{booking.room.lokasi_ruangan}</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p className="font-medium">{booking.Pengguna.nama_lengkap}</p>
            <p>{booking.Pengguna.email}</p>
          </div>
        </div>
      </Dialog.Panel>
    );
  };

  return (
    <MainLayout>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Jadwal Ruangan</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-medium min-w-[150px] text-center">
              {format(currentDate, 'MMMM yyyy', { locale: id })}
            </span>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <RoomLegend />
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
              const rowIndex = Math.floor(index / 7);

              return (
                <div 
                  key={dateStr} 
                  className={getDateClasses(day, rowIndex)}
                  style={{
                    height: rowHeights[rowIndex] ? `${rowHeights[rowIndex]}px` : 'auto',
                    minHeight: '8rem'
                  }}
                >
                  <div className={`text-sm mb-2 ${
                    isToday(day) ? 'text-blue-600 font-semibold' : 'text-gray-500'
                  }`}>
                    {format(day, 'd')}
                  </div>

                  <DayCell
                    dateStr={dateStr}
                    bookings={bookings}
                    isPastDate={isPastDate}
                  />
                </div>
              );
            })}
            </div>
          </div>
        )}

        <Dialog
          open={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <BookingDetailModal
              booking={selectedBooking}
              onClose={() => setSelectedBooking(null)}
            />
          </div>
        </Dialog>
      </div>
    </MainLayout>
  );
}