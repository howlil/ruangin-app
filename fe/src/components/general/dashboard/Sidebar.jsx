import {
  LayoutDashboard,
  FileText,
  FolderClosed,
  Users,
  UserCircle,
  History,
  X
} from 'lucide-react';
import Logo from '@/components/general/Navbar/Logo';
import { SidebarItem } from './SidebarItem';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const menuItems = [
  { icon: LayoutDashboard, text: 'Dashboard', path: '/dashboard' },
  { icon: FileText, text: 'Ajuan Peminjaman', path: '/ajuan-peminjaman' },
  { icon: FolderClosed, text: 'Ruangan', path: '/ruangan' },
  { icon: Users, text: 'Tim Kerja', path: '/tim-kerja' },
  { icon: UserCircle, text: 'Staff', path: '/staff' },
  { icon: History, text: 'Riwayat', path: '/riwayat' },
];

const getMenuTextFromPath = (pathname) => {
  const menu = menuItems.find(item => item.path === pathname);
  return menu ? menu.text : 'Dashboard';
};

export function Sidebar({ activeItem, setActiveItem, isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentText = getMenuTextFromPath(location.pathname);
    setActiveItem(currentText);
  }, [location.pathname, setActiveItem]);

  const handleMenuClick = (text, path) => {
    setActiveItem(text);
    navigate(path);
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className={`
        fixed top-0 left-0 z-30
        w-64 h-full bg-white shadow-lg
        transform transition-transform duration-300
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <Logo />
          <button
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.text}
              icon={item.icon}
              text={item.text}
              active={activeItem === item.text}
              onClick={() => handleMenuClick(item.text, item.path)}
            />
          ))}
        </div>
      </div>
    </>
  );
}