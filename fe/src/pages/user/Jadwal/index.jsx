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
import { ChevronLeft, ChevronRight, Clock, MapPin, User, Calendar, Users, X } from 'lucide-react';
import MainLayout from "@/components/layout/MainLayout";
import api from "@/utils/api";
import { Dialog } from '@headlessui/react';
import { HandleResponse } from '@/components/ui/HandleResponse';


const colorMap = {
  'Ruang Kaca 1': 'bg-purple-100 border-purple-200 text-purple-800',
  'Ruang Kaca 2': 'bg-green-100 border-green-200 text-green-800',
  'Ruang Kaca 3': 'bg-orange-100 border-orange-200 text-orange-800',
  'Ruang Vicon': 'bg-blue-100 border-blue-200 text-blue-800',
  'default': 'bg-gray-100 border-gray-200 text-gray-800'
};

export default function Jadwal() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDates, setExpandedDates] = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await api.get('/v1/ruang-rapat', {
          params: {
            status: 'DISETUJUI',
            month: format(currentDate, 'yyyy-MM')
          }
        });
        setRooms(response.data.data);
      } catch (error) {
          HandleResponse({
                error,
              });
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const today = startOfDay(new Date());

  // Group bookings by date
  const bookingsByDate = rooms.reduce((acc, room) => {
    room.peminjaman.forEach(booking => {
      if (booking.status === 'DISETUJUI') {
        if (!acc[booking.tanggal]) {
          acc[booking.tanggal] = [];
        }
        acc[booking.tanggal].push({
          ...booking,
          room: {
            nama_ruangan: room.nama_ruangan,
            lokasi_ruangan: room.lokasi_ruangan,
            foto_ruangan: room.foto_ruangan,
            kapasitas: room.kapasitas,
            deskripsi: room.deskripsi
          }
        });
      }
    });
    return acc;
  }, {});

  const getDateClasses = (day) => {
    const baseClasses = "relative min-h-[120px] p-2";
    const isCurrentMonth = isSameMonth(day, currentDate);
    const isPastDate = isBefore(day, today);
    const isCurrentDate = isToday(day);
    
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

    return classes.join(' ');
  };

  const toggleDateExpansion = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Jadwal Ruangan</h1>
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
              {calendarDays.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const bookings = bookingsByDate[dateStr] || [];
                const isExpanded = expandedDates[dateStr];
                const displayCount = isExpanded ? bookings.length : Math.min(3, bookings.length);
                const isPastDate = isBefore(day, today);

                return (
                  <div
                    key={dateStr}
                    className={getDateClasses(day)}
                  >
                    <div className={`text-sm mb-2 ${
                      isToday(day) 
                        ? 'text-blue-600 font-semibold' 
                        : 'text-gray-500'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {!isPastDate && bookings.slice(0, displayCount).map((booking) => (
                        <div
                          key={booking.id}
                          onClick={() => handleBookingClick(booking)}
                          className={`text-xs p-1 rounded border cursor-pointer transition-colors hover:opacity-80 ${
                            colorMap[booking.room.nama_ruangan] || colorMap.default
                          }`}
                        >
                          <div className="font-medium">{booking.room.nama_ruangan}</div>
                          <div>{booking.jam_mulai} - {booking.jam_selesai}</div>
                        </div>
                      ))}
                      {!isPastDate && bookings.length > 3 && (
                        <button
                          onClick={() => toggleDateExpansion(dateStr)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          {isExpanded ? 'Tampilkan lebih sedikit' : `Tampilkan ${bookings.length - 3} lainnya`}
                        </button>
                      )}
                    
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detail Modal */}
        <Dialog
          open={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          
          <div className="fixed inset-0 bottom-10 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
              {selectedBooking && (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <Dialog.Title className="text-xl font-semibold">
                      Detail Peminjaman
                    </Dialog.Title>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${selectedBooking.room.foto_ruangan}`}
                      alt={selectedBooking.room.nama_ruangan}
                      className="w-full h-48 object-cover rounded-lg"
                    />

                    <div>
                      <h3 className="text-lg font-medium">{selectedBooking.room.nama_ruangan}</h3>
                      <p className="text-gray-600 mt-1">{selectedBooking.room.deskripsi}</p>
                      <p className="text-blue-600 mt-2 font-medium">{selectedBooking.nama_kegiatan}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{format(parseISO(selectedBooking.tanggal), 'EEEE, d MMMM yyyy', { locale: id })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{selectedBooking.jam_mulai} - {selectedBooking.jam_selesai} WIB</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedBooking.room.lokasi_ruangan}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>Kapasitas: {selectedBooking.room.kapasitas} orang</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <div>
                          <span className="font-medium">{selectedBooking.Pengguna.nama_lengkap}</span>
                          <span className="block text-sm">{selectedBooking.Pengguna.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </MainLayout>
  );
}