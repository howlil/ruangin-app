import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  data = [],
  pagination,
  onPageChange,
  onPageSizeChange
}) => {
  const { page, total_pages } = pagination;


  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(total_pages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < total_pages - 1) {
      rangeWithDots.push('...', total_pages);
    } else if (total_pages > 1) {
      if (!range.includes(total_pages)) {
        rangeWithDots.push(total_pages);
      }
    }

    return total_pages === 1 ? [1] : rangeWithDots;
  };

  if (data.length < 10 && total_pages <= 1) return null;

  return (
    <div className="mt-6 py-4">
      {/* Mobile View */}
      <div className="flex justify-between items-center lg:hidden">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-full 
            border border-gray-200 transition-all duration-200 ease-in-out
            hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-gray-600">
          Page {pagination.page} of {pagination.total_pages}
        </span>
        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.total_pages}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-full 
            border border-gray-200 transition-all duration-200 ease-in-out
            hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">
            Showing <span className="font-semibold text-gray-900">{((pagination.page - 1) * pagination.size) + 1}</span> to{' '}
            <span className="font-semibold text-gray-900">{Math.min(pagination.page * pagination.size, pagination.total_rows)}</span> of{' '}
            <span className="font-semibold text-gray-900">{pagination.total_rows}</span> entries
          </p>
        </div>
        <div className="flex items-center space-x-6">
          <select
            value={pagination.size}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-full 
              border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 
              transition-all duration-200 ease-in-out appearance-none
              bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMTZMMTcgMTFIMTJMNyAxMUwxMiAxNloiIGZpbGw9IiM2QjcyODAiLz48L3N2Zz4=')] 
              bg-[length:20px_20px] bg-no-repeat bg-[center_right_4px] pr-8"
          >
            <option value={10}>10 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </select>

          <nav className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 text-gray-600 bg-white rounded-full transition-all duration-200 ease-in-out
                hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40 disabled:hover:bg-white"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center">
              {getPaginationRange().map((page, index) => (
                <button
                  key={index}
                  onClick={() => page !== '...' && onPageChange(page)}
                  disabled={page === '...'}
                  className={`min-w-[2.5rem] h-10 mx-0.5 text-sm font-medium rounded-full
                    transition-all duration-200 ease-in-out
                    ${page === pagination.page
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      : page === '...'
                        ? 'text-gray-400 cursor-default'
                        : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.total_pages}
              className="p-2 text-gray-600 bg-white rounded-full transition-all duration-200 ease-in-out
                hover:bg-gray-100 active:bg-gray-200 disabled:opacity-40 disabled:hover:bg-white"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;