import { useState, useEffect } from 'react';
import {  eachDayOfInterval, parseISO, format } from 'date-fns';
import { HandleResponse } from '@/components/ui/HandleResponse';

export const useBookingCalendar = (api) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [expandedCells, setExpandedCells] = useState({});

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const response = await api.get('/v1/ruang-rapat', {
                    params: {
                        month: format(currentDate, 'yyyy-MM')
                    }
                });
                setRooms(response.data.data);
            } catch (error) {
                HandleResponse({error})
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [currentDate, api]);

    const bookingsByDate = rooms.reduce((acc, room) => {
        room.peminjaman.forEach(booking => {
            if (['DISETUJUI', 'SELESAI', 'DIPROSES'].includes(booking.status)) {
                const startDate = parseISO(booking.tanggal_mulai);
                const endDate = booking.tanggal_selesai ? parseISO(booking.tanggal_selesai) : startDate;

                eachDayOfInterval({ start: startDate, end: endDate }).forEach(date => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    if (!acc[dateStr]) acc[dateStr] = [];
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

    return {
        currentDate,
        setCurrentDate,
        rooms,
        loading,
        selectedBooking,
        setSelectedBooking,
        expandedCells,
        setExpandedCells,
        bookingsByDate
    };
};
