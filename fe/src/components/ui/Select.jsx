const Select = ({ 
    children, 
    className = '', 
    error,
    disabled = false,
    ...props 
  }) => {
    return (
      <div className="relative">
        <select
          className={`
            block w-full rounded-full border border-gray-300 py-2 pl-3 pr-10 
            text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
            sm:text-sm
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          disabled={disabled}
          {...props}
        >
          {children}
        </select>
        
  
        {error && (
          <p className="mt-1 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  };
  
  export default Select;