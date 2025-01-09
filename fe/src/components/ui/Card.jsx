import React from 'react';

const variants = {
  default: 'bg-white border border-gray-200',
  elevated: 'bg-white shadow-lg',
  flat: 'bg-gray-50 border border-gray-100',
  outlined: 'bg-transparent border border-gray-200',
};

export const Card = ({
  children,
  className = '',
  variant = 'default',
  hover = false,
  ...props
}) => {
  const baseStyles = 'rounded-lg transition-all duration-200';
  const variantStyles = variants[variant] || variants.default;
  const hoverStyles = hover ? 'hover:shadow-md hover:-translate-y-0.5' : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className = '',
  ...props
}) => (
  <div
    className={`px-6 py-4 border-b border-gray-200 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({
  children,
  className = '',
  ...props
}) => (
  <h3
    className={`text-xl font-semibold text-gray-900 ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({
  children,
  className = '',
  ...props
}) => (
  <p
    className={`mt-1 text-sm text-gray-500 ${className}`}
    {...props}
  >
    {children}
  </p>
);

export const CardContent = ({
  children,
  className = '',
  ...props
}) => (
  <div
    className={`px-6 py-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardFooter = ({
  children,
  className = '',
  ...props
}) => (
  <div
    className={`px-6 py-4 border-t border-gray-200 ${className}`}
    {...props}
  >
    {children}
  </div>
);

