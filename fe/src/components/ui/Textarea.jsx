export const Textarea = ({ className = '', ...props }) => (
    <textarea
      className={`block w-full rounded-md border-gray-300 shadow-sm 
      focus:border-primary focus:ring-primary sm:text-sm ${className}`}
      {...props}
    />
  );