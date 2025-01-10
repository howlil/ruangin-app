
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const DesktopNav = ({ navItems, isScrolled, isActivePath, isDropdownOpen }) => {
  const navigate = useNavigate();

  const handleNavClick = (item) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div className="hidden lg:flex lg:items-center lg:space-x-8">
      {navItems.map((item, index) => (
        <div key={index} className="relative">
          <button
            onClick={() => handleNavClick(item)}
            className={`
              px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1
              ${item.path && isActivePath(item.path)
                ? 'text-primary' 
                : isScrolled 
                  ? 'text-gray-700 hover:text-primary'
                  : 'text-gray-700 hover:text-primary'
              }
            `}
          >
            {item.name}
            {item.isDropdownTrigger && (
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default DesktopNav;