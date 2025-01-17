
// src/components/Navbar/UserMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import api from '@/utils/api';
import { HandleResponse } from '@/components/ui/HandleResponse';


const UserMenu = ({ isScrolled }) => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await api.post('/api/v1/logout', {}, {      });
      HandleResponse({response})
      logout();
      navigate('/');
    } catch (error) {
      HandleResponse({
        error,
        errorMessage: 'Gagal menghapus ruangan'
      });
            logout();
      navigate('/');
    }
  };

  if (!user) {
    return (
      <div className="hidden md:block">
        <Button 
          className="px-8" 
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden md:block relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors duration-200 ${
          isScrolled
            ? 'hover:bg-blue-50/50 text-gray-700'
            : 'hover:bg-white/10 text-white'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
          {user.nama_lengkap.charAt(0)}
        </div>
        <span className={isScrolled ? 'text-gray-700' : 'text-white'}>
          {user.nama_lengkap}
        </span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 transform origin-top transition-all duration-200 ease-in-out ${
          isDropdownOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        {user.role === 'ADMIN' || user.role === 'SUPERADMIN' ? (
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
          >
            Dashboard
          </button>
        ) : null}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserMenu