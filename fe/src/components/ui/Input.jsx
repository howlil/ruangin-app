import React, { forwardRef, useState } from 'react';
import { cn } from '@/utils/utils';
import { Eye, EyeOff } from 'lucide-react';

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