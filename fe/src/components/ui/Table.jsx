import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown } from 'lucide-react';
import Pagination from './Pagination';
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

  console.log(data)

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
                        <div className="absolute right-0  mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[99]">
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

      <Pagination
        data={data}
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default Table;