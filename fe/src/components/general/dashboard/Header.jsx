import { useState, useRef, useEffect } from 'react';
import { LogOut, Home, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import api from '@/utils/api';
import { HandleResponse } from '@/components/ui/HandleResponse';

export function Header({ user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useUser();

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
      const response =await api.post('/v1/logout');
      HandleResponse({response})
      logout();
      navigate('/login');
    } catch (error) {
      HandleResponse({
        error,
        errorMessage: 'Gagal menghapus ruangan'
      });
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="relative ml-auto" ref={dropdownRef}>
      <button
        className="flex items-center gap-3 focus:outline-none"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-700">{user.nama_lengkap}</p>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 
              ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </div>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
          {user.nama_lengkap.charAt(0)}
        </div>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`
          absolute right-0 mt-2 w-48 rounded-md shadow-lg 
          bg-white ring-1 ring-black ring-opacity-5
          transform transition-all duration-200 ease-in-out
          ${isDropdownOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
        `}
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <Home className="w-4 h-4" />
          Home
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
