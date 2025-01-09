import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarItem } from './SidebarItem';
import Logo from '../Navbar/Logo';
import { MENU_ITEMS } from './constants';
import { hasPermission } from '@/utils/auth';


export function Sidebar({ activeItem, setActiveItem, isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  const handleMenuClick = (text, path) => {
    setActiveItem(text);
    navigate(path);
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  // Filter menu items based on user permissions
  const filteredMenuItems = MENU_ITEMS.filter(item => 
    hasPermission(item.allowedRoles)
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <Logo />
          <button
            onClick={toggleSidebar}
            className="lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4">
          {filteredMenuItems.map((item) => (
            <SidebarItem
              key={item.text}
              icon={item.icon}
              text={item.text}
              active={activeItem === item.text}
              onClick={() => handleMenuClick(item.text, item.path)}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}