import React from 'react';
import NavLink from './NavLink';

const DesktopNav = ({ navItems }) => {
  return (
    <div className="hidden md:block">
      <div className="ml-10 flex items-center space-x-4">
        {navItems.map((item) => (
          <NavLink key={item.name} href={item.path}>
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default DesktopNav;