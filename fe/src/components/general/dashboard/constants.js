import {
    LayoutDashboard,
    FileText,
    FolderClosed,
    Users,
    UserCircle,
    History
} from 'lucide-react';
import { ROLES } from '@/utils/auth';

export const MENU_ITEMS = [
    {
        icon: LayoutDashboard,
        text: 'Dashboard',
        path: '/dashboard',
        allowedRoles: [ROLES.ADMIN, ROLES.SUPERADMIN]
    },
    {
        icon: FileText,
        text: 'Ajuan Peminjaman',
        path: '/ajuan-peminjaman',
        allowedRoles: [ROLES.ADMIN, ROLES.SUPERADMIN]
    },
    {
        icon: FolderClosed,
        text: 'Ruangan',
        path: '/ruangan',
        allowedRoles: [ROLES.SUPERADMIN]
    },
    {
        icon: Users,
        text: 'Tim Kerja',
        path: '/tim-kerja',
        allowedRoles: [ROLES.SUPERADMIN]
    },
    {
        icon: UserCircle,
        text: 'Pengguna',
        path: '/staff',
        allowedRoles: [ROLES.SUPERADMIN]
    },
    {
        icon: History,
        text: 'Riwayat',
        path: '/riwayat',
        allowedRoles: [ROLES.ADMIN, ROLES.SUPERADMIN]
    }
];