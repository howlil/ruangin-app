import React from 'react';
import NavLink from './NavLink';

const MobileNav = ({ isOpen, navItems, isLoggedIn, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.path}
            className="text-gray-600 hover:text-blue-600 block px-3 py-2 text-base font-medium"
          >
            {item.name}
          </a>
        ))}
        {!isLoggedIn && (
          <button
            onClick={onLogin}
            className="w-full text-left bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileNav;