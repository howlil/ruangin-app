import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import Button from '@/components/ui/Button';

const MobileNav = ({ isOpen, navItems, isScrolled }) => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.path}
            className={`block px-3 py-2 text-base font-medium rounded-md ${
              isScrolled
                ? 'text-gray-700 '
                : 'text-black tc hover:bg-gray-100'
            }`}
          >
            {item.name}
          </a>
        ))}
        
        {user ? (
          <>
            {(user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Dashboard
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
            >
              Logout
            </button>
          </>
        ) : (
          <Button
            className="w-full"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileNav;