import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import UserMenu from './UserMenu';
import MobileMenuButton from './MobileMenuButton';
import RoomPopup from './RoomPopup';
import { useUser } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLocation } from 'react-router-dom';
import api from '@/utils/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useUser();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (!isMobile) {
        setIsScrolled(window.scrollY > 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handlePeminjamanClick = async () => {
    if (!rooms.length && !loading) {
      setLoading(true);
      try {
        const response = await api.get('/v1/ruang-rapat');
        setRooms(response.data.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Jadwal', path: '/jadwal' },
    {
      name: 'Peminjaman',
      onClick: handlePeminjamanClick,
      isDropdownTrigger: true
    },
    ...(user ? [{ name: 'Riwayat', path: '/u/riwayat' }] : []),
  ];

  const isActivePath = (path) => {
    if (!path) return false;
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const navBackground = () => {
    if (isMobile || isDropdownOpen) {
      return 'bg-white shadow-sm';
    }
    return isScrolled ? 'bg-white shadow-sm' : 'bg-transparent';
  };

  return (
    <>
      <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${navBackground()}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="flex items-center justify-between h-16 relative">
            <Logo isScrolled={!isMobile && isScrolled} />
            <DesktopNav
              navItems={navItems}
              isScrolled={!isMobile && isScrolled}
              isActivePath={isActivePath}
              isDropdownOpen={isDropdownOpen}
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
            <RoomPopup
              rooms={rooms}
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
              loading={loading}
            />
          </div>
        </div>
        <MobileNav
          isOpen={isOpen}
          navItems={navItems}
          rooms={rooms}
        />
      </nav>

      {isDropdownOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;