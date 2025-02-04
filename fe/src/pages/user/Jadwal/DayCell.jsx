
import {  useRef } from 'react';
import { BookingCard } from './BookingCard';

export const DayCell = ({  bookings, onBookingClick }) => {
    const cellRef = useRef(null);


    if (!bookings.length) return null;

    return (
        <div 
            ref={cellRef} 
            className="space-y-1 h-full max-h-[120px]  overflow-y-auto no-scrollbar scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 pr-1"
        >
            {bookings.map((booking, idx) => (
                <BookingCard
                    key={`${booking.id}-${idx}`}
                    booking={booking}
                    onClick={onBookingClick}
                />
            ))}
        </div>
    );
};

