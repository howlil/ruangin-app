import { useState, useEffect } from 'react';
import { Header } from '../general/dashboard/Header';
import { Sidebar } from '../general/dashboard/Sidebar';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(() => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    return path.substring(1).split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button 
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex">
        <Sidebar 
          activeItem={activeItem} 
          setActiveItem={setActiveItem}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <Header />
          <main className="p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6">{activeItem}</h1>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}