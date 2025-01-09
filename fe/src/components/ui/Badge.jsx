import React from 'react';

const variants = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-primary-100 text-primary-800',
  secondary: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800',
};

export const Badge = ({ 
  children, 
  variant = 'default', 
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variantStyles = variants[variant] || variants.default;

  return (
    <span
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
