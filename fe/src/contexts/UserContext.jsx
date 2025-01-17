// import { createContext,useContext, useState, useEffect } from 'react';
// import { getUserDataFromCookie, clearAuthCookies } from '@/utils/cookie';
// import { useNavigate } from 'react-router-dom';

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const initializeUser = () => {
//       try {
//         const userData = getUserDataFromCookie();
//         if (userData) {
//           setUser(userData.user);
//         }
//       } catch (error) {
//         console.error('Error initializing user:', error);
//         clearAuthCookies();
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeUser();
//   }, []);

//   const logout = () => {
//     clearAuthCookies();
//     setUser(null);
//     navigate('/login');
//   };

//   const updateUser = (userData) => {
//     setUser(userData);
//   };

//   return (
//     <UserContext.Provider value={{ user, loading, logout, updateUser }}>
//       {!loading && children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//     const context = useContext(UserContext);
//     if (!context) {
//       throw new Error('useUser must be used within a UserProvider');
//     }
//     return context;
//   };
  

// src/contexts/UserContext.jsx
// import { createContext, useContext, useState, useEffect } from 'react';
// import { getUserDataFromCookie, clearAuthCookies, storeUserDataInCookie } from '@/utils/cookie';
// import { useNavigate, useLocation } from 'react-router-dom';

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     initializeUser();
//   }, []);

//   const initializeUser = () => {
//     try {
//       const userData = getUserDataFromCookie();
//       if (userData) {
//         setUser(userData.user);
//         // Ensure token in localStorage matches cookie
//         localStorage.setItem("token", userData.token);
//       } else {
//         // If no user data in cookies, clear everything
//         handleLogout();
//       }
//     } catch (error) {
//       console.error('Error initializing user:', error);
//       handleLogout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     clearAuthCookies();
//     localStorage.removeItem("token");
//     setUser(null);
    
//     // Only redirect to login if not already there
//     if (!location.pathname.includes('/login')) {
//       navigate('/login');
//     }
//   };

//   const updateUser = (userData) => {
//     setUser(userData);
//     // When updating user, also ensure cookie data is fresh
//     storeUserDataInCookie(userData, localStorage.getItem("token"));
//   };

//   const value = {
//     user,
//     loading,
//     logout: handleLogout,
//     updateUser,
//     initializeUser // Export this so we can call it after login
//   };

//   // If loading, show nothing
//   if (loading) {
//     return null;
//   }

//   // Protect routes that require authentication
//   const isAuthRequired = !location.pathname.includes('/login');
//   const hasAuth = !!user && !!localStorage.getItem("token");

//   if (isAuthRequired && !hasAuth) {
//     navigate('/login');
//     return null;
//   }

//   return (
//     <UserContext.Provider value={value}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };


import { createContext, useContext, useState, useEffect } from 'react';
import { getUserDataFromCookie, clearAuthCookies, storeUserDataInCookie } from '@/utils/cookie';
import { useNavigate, useLocation } from 'react-router-dom';

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
      console.error('Error initializing user:', error);
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