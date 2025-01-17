// MobileNav.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import Button from '@/components/ui/Button';
import { LogOut, LayoutDashboard, ChevronDown, ChevronUp } from 'lucide-react';
import { HandleResponse } from '@/components/ui/HandleResponse';

const MobileNav = ({ isOpen, navItems, rooms }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      HandleResponse({
        error,
        errorMessage: 'Gagal menghapus ruangan'
      });
    }
  };

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleRoomClick = (roomId) => {
    navigate(`/peminjaman/${roomId}`);
    setIsRoomDropdownOpen(false);
  };

  return (
    <div className="lg:hidden absolute top-16 inset-x-0 bg-white shadow-lg">
      <div className="px-4 py-3 space-y-1 divide-y divide-gray-100">
        <div className="space-y-1 pb-3">
          {navItems.map((item) => {
            if (item.isDropdownTrigger) { // Changed from isPopupTrigger
              return (
                <div key={item.name}>
                  <button
                    onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
                    className={`
                      flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-md transition-all duration-200
                      ${location.pathname.includes('/peminjaman')
                        ? 'text-primary bg-primary/5'
                        : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                      }
                    `}
                  >
                    <span>{item.name}</span>
                    {isRoomDropdownOpen ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>

                  {isRoomDropdownOpen && rooms && (
                    <div className="mt-1 pl-4 space-y-1 border-l-2 border-gray-100 ml-3">
                      {rooms.map((room) => (
                        <button
                          key={room.id}
                          onClick={() => handleRoomClick(room.id)}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 rounded-md transition-colors duration-200 text-gray-600 hover:text-primary"
                        >
                          {room.nama_ruangan}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  block px-3 py-2 text-base font-medium rounded-md transition-all duration-200
                  ${isActivePath(item.path)
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }
                `}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {user ? (
          <div className="space-y-1 pt-3">
            <div className="px-3 py-2">
              <p className="text-base font-medium text-gray-900">{user.nama_lengkap}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            {(user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
              <Link
                to="/dashboard"
                className={`
                  flex items-center gap-2 w-full px-3 py-2 text-base font-medium rounded-md
                  ${location.pathname.startsWith('/dashboard')
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }
                `}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        ) : (
          <div className="pt-3 px-3">
            <Button
              className="w-full justify-center"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNav;