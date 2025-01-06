import React from 'react';
import { Menu, X } from 'lucide-react';

const MobileMenuButton = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 tc hover:text-blue-600 hover:bg-gray-100"
    >
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  );
};
export default MobileMenuButton;
