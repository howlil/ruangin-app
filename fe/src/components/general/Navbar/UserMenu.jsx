import React from 'react';
import { User } from 'lucide-react';
import Button from '@/components/ui/Button';

const UserMenu = ({ isLoggedIn, onLogin }) => {
  return (
    <div className="hidden md:block">
      {isLoggedIn ? (
        <button
          onClick={onLogin}
          className="p-1 rounded-full bg-gray-100 text-gray-600 hover:text-blue-600"
        >
          <User className="h-6 w-6" />
        </button>
      ) : (
        <Button className='px-8' onClick={onLogin}>
          Login
        </Button>
      )}
    </div>
  );
};

export default UserMenu;