import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import UserMenu from './UserMenu';
import MobileMenuButton from './MobileMenuButton';
import { useUser } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/useResponsive';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      if (!isMobile) {
        setIsScrolled(window.scrollY > 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]); 

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Jadwal', path: '/jadwal' },
    { name: 'Peminjaman', path: '/peminjaman' },
    ...(user ? [{ name: 'Riwayat', path: '/u/riwayat' }] : []),
  ];

  const navBackground = () => {
    if (isMobile) {
      return 'bg-white shadow-sm';
    }
    return isScrolled ? 'bg-white shadow-sm' : 'bg-transparent';
  };

  return (
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${navBackground()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex items-center justify-between h-16">
          <Logo isScrolled={!isMobile && isScrolled} />
          <DesktopNav 
            navItems={navItems} 
            isScrolled={!isMobile && isScrolled} 
          />
          <div className="flex items-center">
            <UserMenu
              isScrolled={!isMobile && isScrolled}
            />
            <MobileMenuButton
              isOpen={isOpen}
              onClick={toggleMenu}
              isScrolled={!isMobile && isScrolled}
            />
          </div>
        </div>
      </div>
      <MobileNav
        isOpen={isOpen}
        navItems={navItems}
        isScrolled={!isMobile && isScrolled}
      />
    </nav>
  );
};

export default Navbar;