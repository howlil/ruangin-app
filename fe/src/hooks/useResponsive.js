// src/utils/useResponsive.js
import { useState, useEffect } from 'react';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const breakpoints = {
  mobile: 640,  
  tablet: 768, 
  desktop: 1024 
};

export const useIsMobile = () => {
  const { width } = useWindowSize();
  return width ? width < breakpoints.mobile : false;
};

export const useIsTablet = () => {
  const { width } = useWindowSize();
  return width ? width >= breakpoints.mobile && width < breakpoints.desktop : false;
};

export const useIsDesktop = () => {
  const { width } = useWindowSize();
  return width ? width >= breakpoints.desktop : false;
};



export const useResponsive = () => {
  const { width } = useWindowSize();

  return {
    isMobile: width ? width < breakpoints.mobile : false,
    isTablet: width ? width >= breakpoints.mobile && width < breakpoints.desktop : false,
    isDesktop: width ? width >= breakpoints.desktop : false,
    width,
  };
};

export const useBreakpoint = (breakpoint) => {
  const { width } = useWindowSize();
  return width ? width >= breakpoint : false;
};

export const useResponsiveOptimized = (delay = 250) => {
  const [state, setState] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: undefined
  });

  useEffect(() => {
    let timeoutId = null;

    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        setState({
          isMobile: width < breakpoints.mobile,
          isTablet: width >= breakpoints.mobile && width < breakpoints.desktop,
          isDesktop: width >= breakpoints.desktop,
          width
        });
      }, delay);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [delay]);

  return state;
};