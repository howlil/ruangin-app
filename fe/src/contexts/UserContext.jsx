import { createContext,useContext, useState, useEffect } from 'react';
import { getUserDataFromCookie, clearAuthCookies } from '@/utils/cookie';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = () => {
      try {
        const userData = getUserDataFromCookie();
        if (userData) {
          setUser(userData.user);
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        clearAuthCookies();
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const logout = () => {
    clearAuthCookies();
    setUser(null);
    navigate('/login');
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, loading, logout, updateUser }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
  };
  