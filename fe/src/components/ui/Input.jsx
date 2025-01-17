import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { cn } from '@/utils/utils';
import { Eye, EyeOff, Clock } from 'lucide-react';

const TimePickerDropdown = ({
  isOpen,
  onClose,
  selectedHour,
  selectedMinute,
  onSelectTime,
  position = 'top'
}) => {
  const hours = Array.from({ length: 11 }, (_, i) => {
    const h = i + 7;
    return h.toString().padStart(2, '0');
  });

  const minutes = Array.from({ length: 60 }, (_, i) => {
    return i.toString().padStart(2, '0');
  });

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute left-0  right-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200",
        "grid grid-cols-2 overflow-y-scroll divide-x max-h-[280px]",
        position === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
      )}
    >
      {/* Hours Column */}
      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
        {hours.map(hour => (
          <button
            type="button" // Menambahkan type="button"
            key={hour}
            className={cn(
              "w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors",
              selectedHour === hour && "bg-blue-500 text-white hover:bg-blue-600"
            )}
            onClick={(e) => {
              e.preventDefault(); // Mencegah form submission
              e.stopPropagation(); // Mencegah event bubbling
              onSelectTime('hour', hour);
            }}
          >
            {hour}
          </button>
        ))}
      </div>

      <div className="overflow-y-auto scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
        {minutes.map(minute => (
          <button
            type="button" // Menambahkan type="button"
            key={minute}
            className={cn(
              "w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors",
              selectedMinute === minute && "bg-blue-500 text-white hover:bg-blue-600"
            )}
            onClick={(e) => {
              e.preventDefault(); // Mencegah form submission
              e.stopPropagation(); // Mencegah event bubbling
              onSelectTime('minute', minute);
            }}
          >
            {minute}
          </button>
        ))}
      </div>
    </div>
  );
};


const TimeInput = ({ value, onChange, name, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, selectedMinute] = value ? value.split(':') : ['', ''];
  const containerRef = useRef(null);

  const handleSelectTime = (type, val) => {
    let newHour = selectedHour;
    let newMinute = selectedMinute;

    if (type === 'hour') {
      newHour = val;
      if (!selectedMinute) newMinute = '00';
    } else {
      newMinute = val;
      if (!selectedHour) newHour = '07';
    }

    onChange({
      target: {
        name,
        value: `${newHour}:${newMinute}`
      }
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">

      <TimePickerDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        selectedHour={selectedHour}
        selectedMinute={selectedMinute}
        onSelectTime={handleSelectTime}
        position="top"
      />
      <div
        className={cn(
          "px-3 py-2 bg-white border border-gray-300 rounded-full text-sm w-full",
          "focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent",
          "cursor-pointer flex items-center justify-between",
          disabled && "bg-gray-100 cursor-not-allowed opacity-60"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <input
          type="text"
          readOnly
          disabled={disabled}
          value={value || ''}
          placeholder="Pilih Waktu"
          className="bg-transparent border-none focus:outline-none w-full cursor-pointer disabled:cursor-not-allowed"
        />
        <Clock className="w-4 h-4 text-gray-400 ml-2" />
      </div>


    </div>
  );
};

const Input = forwardRef(({
  className,
  type = "text",
  error,
  label,
  helperText,
  required,
  fullWidth = false,
  startIcon,
  endIcon,
  disabled = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const isTimeType = type === "time";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = isPasswordType ? (showPassword ? "text" : "password") : type;

  return (
    <div className={cn("flex flex-col gap-1", fullWidth && "w-full")}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {isTimeType ? (
          <TimeInput
            value={props.value}
            onChange={props.onChange}
            name={props.name}
            disabled={disabled}
          />
        ) : (
          <>
            {startIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                {startIcon}
              </div>
            )}

            <input
              ref={ref}
              type={inputType}
              disabled={disabled}
              className={cn(
                "px-3 py-2 bg-white border border-gray-300 rounded-full text-sm",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "disabled:bg-gray-100 disabled:cursor-not-allowed",
                error && "border-red-500 focus:ring-red-500",
                startIcon && "pl-10",
                (endIcon || isPasswordType) && "pr-10",
                fullWidth && "w-full",
                className
              )}
              {...props}
            />

            {isPasswordType && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}

            {!isPasswordType && endIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {endIcon}
              </div>
            )}
          </>
        )}
      </div>

      {helperText && (
        <p className={cn(
          "text-xs",
          error ? "text-red-500" : "text-gray-500"
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;