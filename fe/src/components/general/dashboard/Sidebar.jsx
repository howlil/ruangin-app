import {
  LayoutDashboard,
  FileText,
  FolderClosed,
  Users,
  UserCircle,
  History,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarItem } from './SidebarItem';
import Logo from '../Navbar/Logo';

const MENU_ITEMS = [
  { icon: LayoutDashboard, text: 'Dashboard', path: '/dashboard' },
  { icon: FileText, text: 'Ajuan Peminjaman', path: '/ajuan-peminjaman' },
  { icon: FolderClosed, text: 'Ruangan', path: '/ruangan' },
  { icon: Users, text: 'Tim Kerja', path: '/tim-kerja' },
  { icon: UserCircle, text: 'Staff', path: '/staff' },
  { icon: History, text: 'Riwayat', path: '/riwayat' },
];

export function Sidebar({ activeItem, setActiveItem, isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  const handleMenuClick = (text, path) => {
    setActiveItem(text);
    navigate(path);
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <aside className={`
      fixed top-0 left-0 z-10 h-full w-64 bg-white shadow-lg
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
        {MENU_ITEMS.map((item) => (
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
  );
}