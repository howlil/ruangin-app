import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import UserMenu from './UserMenu';
import MobileMenuButton from './MobileMenuButton';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Jadwal', path: '/jadwal' },
    { name: 'Peminjaman', path: '/peminjaman' },
    ...(isLoggedIn ? [{ name: 'Riwayat', path: '/riwayat' }] : []),
  ];

  return (
    <nav className={`fixed w-full z-50 top-0 tc ${
      isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex items-center justify-between h-16">
          <Logo isScrolled={isScrolled} />
          <DesktopNav navItems={navItems} isScrolled={isScrolled} />
          <div className="flex items-center">
            <UserMenu 
              isLoggedIn={isLoggedIn} 
              onLogin={toggleLogin} 
              isScrolled={isScrolled} 
            />
            <MobileMenuButton 
              isOpen={isOpen} 
              onClick={toggleMenu} 
              isScrolled={isScrolled}
            />
          </div>
        </div>
      </div>
      <MobileNav
        isOpen={isOpen}
        navItems={navItems}
        isLoggedIn={isLoggedIn}
        onLogin={toggleLogin}
        isScrolled={isScrolled}
      />
    </nav>
  );
};

export default Navbar;