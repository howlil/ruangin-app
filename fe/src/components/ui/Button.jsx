const Button = ({ 
  variant = 'primary',
  color = 'blue',
  children,
  onClick,
  className = '',
  icon: Icon, 
  ...props 
}) => {
  const baseStyles = 'px-6 py-2 rounded-full font-medium tc '; 
  
  const containerStyles = Icon ? 'inline-flex items-center gap-2' : '';
  
  const getVariantStyles = () => {
    const colorMap = {
      blue: {
        primary: 'bg-primary hover:bg-blue-600 text-white ',
        secondary: 'border-2 border-primary text-primary  '
      },
      red: {
        primary: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
        secondary: 'border-2 border-red-500 text-red-500 hover:bg-red-50 focus:ring-red-500'
      },
      green: {
        primary: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
        secondary: 'border-2 border-green-500 text-green-500 hover:bg-green-50 focus:ring-green-500'
      }
    };

    return colorMap[color]?.[variant] || colorMap.blue[variant];
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${containerStyles} ${getVariantStyles()} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default Button;