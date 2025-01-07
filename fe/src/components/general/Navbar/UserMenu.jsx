import React from 'react';
import { User } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

const UserMenu = ({ isLoggedIn }) => {
  const navigate = useNavigate()
  return (
    <div className="hidden md:block">
      {isLoggedIn ? (
        <button
          className="p-1 rounded-full bg-gray-100 text-gray-600 hover:text-blue-600"
        >
          <User className="h-6 w-6" />
        </button>
      ) : (
        <Button className='px-8' onClick={()=>navigate("/login")}>
          Login
        </Button>
      )}
    </div>
  );
};

export default UserMenu;