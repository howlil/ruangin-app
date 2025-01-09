import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Header } from '../general/dashboard/Header';
import { Sidebar } from '../general/dashboard/Sidebar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MENU_ITEMS } from '../general/dashboard/constants';

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const { user, loading } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentMenuItem = MENU_ITEMS.find(item => item.path === currentPath);
    if (currentMenuItem) {
      setActiveItem(currentMenuItem.text);
    }
  }, [location]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className="min-h-screen bg-gray-50">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-10"
          onClick={toggleSidebar}
        />
      )}

      <Sidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className={`
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}
      `}>
        <nav className="sticky top-0 z-10 h-16 bg-white shadow-sm px-4 lg:px-8">
          <div className="h-full flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 lg:hidden"
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Header user={user} />
          </div>
        </nav>

        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
