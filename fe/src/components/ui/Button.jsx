const Button = ({ 
  variant = 'primary',
  color = 'blue',
  children,
  onClick,
  className = '',
  icon: Icon,
  loading = false,
  disabled,
  ...props 
}) => {
  const baseStyles = 'px-6 py-2 rounded-full font-medium focus:outline-none transition-colors duration-200'; 
  const containerStyles = 'inline-flex items-center justify-center gap-2';  // Added justify-center
  const isDisabled = loading || disabled;
  
  const getVariantStyles = () => {
    const colorMap = {
      blue: {
        primary: 'bg-primary hover:bg-blue-600 text-white disabled:bg-blue-300',
        secondary: 'border-2 border-primary text-primary hover:bg-blue-50 disabled:border-blue-300 disabled:text-blue-300'
      },
      red: {
        primary: 'bg-red-500 hover:bg-red-600 text-white disabled:bg-red-300',
        secondary: 'border-2 border-red-500 text-red-500 hover:bg-red-50 disabled:border-red-300 disabled:text-red-300'
      },
      green: {
        primary: 'bg-green-500 hover:bg-green-600 text-white disabled:bg-green-300',
        secondary: 'border-2 border-green-500 text-green-500 hover:bg-green-50 disabled:border-green-300 disabled:text-green-300'
      }
    };

    return colorMap[color]?.[variant] || colorMap.blue[variant];
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${baseStyles} 
        ${containerStyles} 
        ${getVariantStyles()} 
        ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Memproses...
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;