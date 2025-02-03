import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth }) => (
    <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Jadwal Ruangan</h1>
        <div className="flex items-center gap-4">
            <button
                onClick={onPrevMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Previous month"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-medium min-w-[150px] text-center">
                {format(currentDate, 'MMMM yyyy', { locale: id })}
            </span>
            <button
                onClick={onNextMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Next month"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    </div>
);