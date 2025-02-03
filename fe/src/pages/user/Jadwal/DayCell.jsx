// import { useEffect, useRef } from 'react';
// import {BookingCard} from './BookingCard';

// export const DayCell = ({ dateStr, bookings, isPastDate, onBookingClick, isExpanded, onToggleExpand }) => {
//     const cellRef = useRef(null);
//     const MAX_VISIBLE_BOOKINGS = 2;

//     const visibleBookings = isExpanded ? bookings : bookings.slice(0, MAX_VISIBLE_BOOKINGS);
//     const hasMoreBookings = bookings.length > MAX_VISIBLE_BOOKINGS;

//     if (!bookings.length || isPastDate) return null;

//     return (
//         <div ref={cellRef} className="space-y-1 h-full">
//             {visibleBookings.map((booking, idx) => (
//                 <BookingCard
//                     key={`${booking.id}-${idx}`}
//                     booking={booking}
//                     onClick={onBookingClick}
//                 />
//             ))}
//             {hasMoreBookings && (
//                 <button
//                     onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         onToggleExpand(dateStr);
//                     }}
//                     className="w-full text-xs text-blue-600 hover:text-blue-800 
//             flex items-center justify-center gap-1 py-1 hover:bg-blue-50 rounded"
//                 >
//                     {isExpanded ? 'Sembunyikan' : `Lihat ${bookings.length - MAX_VISIBLE_BOOKINGS} lainnya`}
//                 </button>
//             )}
//         </div>
//     );
// };


import {  useRef } from 'react';
import { BookingCard } from './BookingCard';

export const DayCell = ({  bookings, isPastDate, onBookingClick }) => {
    const cellRef = useRef(null);

    if (!bookings.length || isPastDate) return null;

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

