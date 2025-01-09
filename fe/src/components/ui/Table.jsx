import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/useResponsive';

const Table = ({
  headers,
  data,
  pagination,
  onPageChange,
  onPageSizeChange,
  actions,
  onActionClick,
  className = '',
  loading = false
}) => {
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const isMobile = useIsMobile();

  const getPaginationRange = () => {
    const range = [];
    const totalPages = pagination.total_pages;
    const currentPage = pagination.page;
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) range.push(i);
        range.push('...');
        range.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        range.push(1);
        range.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) range.push(i);
      } else {
        range.push(1);
        range.push('...');
        range.push(currentPage - 1);
        range.push(currentPage);
        range.push(currentPage + 1);
        range.push('...');
        range.push(totalPages);
      }
    } else {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    }

    return range;
  };

  const MobileCardView = ({ row, rowIndex }) => {
    const isExpanded = expandedRow === rowIndex;

    return (
      <div className="bg-white border rounded-lg mb-3 overflow-hidden">
        <div
          className="p-4 flex justify-between items-center cursor-pointer"
          onClick={() => setExpandedRow(isExpanded ? null : rowIndex)}
        >
          {/* Show primary column (usually first column) */}
          <div className="font-medium">
            {row[headers[0].key]}
          </div>
          <div className="flex items-center space-x-3">
            {actions && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActionMenu(showActionMenu === rowIndex ? null : rowIndex);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            )}
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''
                }`}
            />
          </div>

          {/* Mobile Action Menu */}
          {showActionMenu === rowIndex && (
            <div className="absolute right-4 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40">
              <div className="py-1" role="menu">
                {actions.map((action, actionIndex) => (
                  <button
                    key={actionIndex}
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick(action.key, row);
                      setShowActionMenu(null);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${action.variant === 'danger'
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t px-4 py-3 space-y-2">
            {headers.slice(1).map((header, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{header.label}:</span>
                <span className="text-sm font-medium">
                  {header.render ? header.render(row) : row[header.key]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full py-8 text-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="lg:hidden space-y-2">
        {data.map((row, rowIndex) => (
          <MobileCardView
            key={rowIndex}
            row={row}
            rowIndex={rowIndex}
          />
        ))}
      </div>

      <div className="hidden lg:block">
        <div className="rounded-lg border bg-white">
          <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
            <thead className="bg-primary/5">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.label}
                  </th>
                ))}
                {actions && (
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {header.render ? header.render(row) : row[header.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button
                        onClick={() => setShowActionMenu(
                          showActionMenu === rowIndex ? null : rowIndex
                        )}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {showActionMenu === rowIndex && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40">
                          <div className="py-1" role="menu">
                            {actions.map((action, actionIndex) => (
                              <button
                                key={actionIndex}
                                onClick={() => {
                                  onActionClick(action.key, row);
                                  setShowActionMenu(null);
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm ${action.variant === 'danger'
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-gray-700 hover:bg-gray-100'
                                  }`}
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data.length > 10 && (
        <div className="mt-4 bg-white rounded-lg border p-4">
          <div className="flex justify-between items-center lg:hidden">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {pagination.page} of {pagination.total_pages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.total_pages}
              className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden lg:flex lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing {((pagination.page - 1) * pagination.size) + 1} to{' '}
                {Math.min(pagination.page * pagination.size, pagination.total_rows)} of{' '}
                {pagination.total_rows} results
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={pagination.size}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="rounded-md border-gray-300 text-sm focus:ring-primary focus:border-primary"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>

              <nav className="relative z-0 inline-flex rounded-full shadow-sm -space-x-px">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-full border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {getPaginationRange().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => page !== '...' && onPageChange(page)}
                    disabled={page === '...'}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === pagination.page
                      ? 'z-10 bg-primary/10 text-black'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      } ${page === '...' ? 'cursor-default' : ''}`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.total_pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-full border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;