import { Calendar, X } from 'lucide-react';
import { useState } from 'react';
import FilterByDate from '@/components/ui/Calenders/FilterByDate';

export default function DateRangePicker({ selectedDate, setSelectedDate, onReset }) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowDatePicker(true)}
        className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 relative group"
      >
        <Calendar className="w-5 h-5" />
        <span>
          {selectedDate
            ? `${selectedDate.start_date}${selectedDate.end_date ? ` - ${selectedDate.end_date}` : ''}`
            : 'Pilih Tanggal'}
        </span>
        {selectedDate && (
          <X
            className="w-4 h-4 ml-2 text-gray-400 hover:text-red-600 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); 
              onReset();
            }}
          />
        )}
      </button>

      {showDatePicker && (
        <FilterByDate
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </>
  );
}