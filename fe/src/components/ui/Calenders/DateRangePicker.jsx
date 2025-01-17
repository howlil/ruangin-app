import { Calendar, X } from 'lucide-react';
import { useState } from 'react';
import FilterByDate from "./FilterByDate"

export default function DateRangePicker({ selectedDate, setSelectedDate, onReset }) {
  const [showDatePicker, setShowDatePicker] = useState(false);


  return (
    <>
      <button
        onClick={() => setShowDatePicker(true)}
        className="flex items-center gap-2 px-4 py-2 border rounded-full w-full hover:bg-gray-50 relative group"
      >
        <Calendar className="w-4 h-4" />
        <span className='text-sm'>
          {selectedDate
            ? `${selectedDate.start_date}${selectedDate.end_date ? ` - ${selectedDate.end_date}` : ''}`
            : 'Pilih Berdasarkan Tanggal'}
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