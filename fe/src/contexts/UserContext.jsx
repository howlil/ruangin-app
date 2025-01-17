
import { createContext, useContext, useState, useEffect } from 'react';
import { getUserDataFromCookie, clearAuthCookies, storeUserDataInCookie } from '@/utils/cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import { HandleResponse } from '@/components/ui/HandleResponse';


const UserContext = createContext();

const PUBLIC_ROUTES = ['/login', '/', '/jadwal', '/peminjaman/*'];

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = () => {
    try {
      const userData = getUserDataFromCookie();
      if (userData) {
        setUser(userData.user);
        localStorage.setItem("token", userData.token);
      } else {
        handleLogout(false); 
      }
    } catch (error) {
      HandleResponse({
        error,
        errorMessage: 'Gagal menghapus ruangan'
      });
            handleLogout(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = (shouldRedirect = true) => {
    clearAuthCookies();
    localStorage.removeItem("token");
    setUser(null);
    
    if (shouldRedirect && !location.pathname.includes('/login')) {
      navigate('/login');
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    storeUserDataInCookie(userData, localStorage.getItem("token"));
  };

  const value = {
    user,
    loading,
    logout: handleLogout,
    updateUser,
    initializeUser
  };

  if (loading) {
    return null;
  }

  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    location.pathname.startsWith(route)
  );
  const hasAuth = !!user && !!localStorage.getItem("token");

  if (!isPublicRoute && !hasAuth) {
    navigate('/login');
    return null;
  }

  return (
    <UserContext.Provider value={value}>
      {children}
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