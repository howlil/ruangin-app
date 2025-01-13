import { getUserDataFromCookie } from './cookie';

export const ROLES = {
    SUPERADMIN: 'SUPERADMIN',
    ADMIN: 'ADMIN',
    PEMINJAM: 'PEMINJAM'
};

export const getUser = () => {
    try {
        const userData = getUserDataFromCookie()
        if (!userData) return null;
        return userData.user;
    } catch (error) {
        return null;
    }
};

export const getUserRole = () => {
    const user = getUser();
    return user?.role || null;
};

export const hasPermission = (requiredRoles) => {
    const userRole = getUserRole();
    if (!userRole) return false;
    return requiredRoles.includes(userRole);
};

// Define route permissions
export const ROUTE_PERMISSIONS = {
    // Admin Routes
    '/dashboard': [ROLES.SUPERADMIN, ROLES.ADMIN],
    '/ajuan-peminjaman': [ROLES.SUPERADMIN, ROLES.ADMIN],
    '/divisi': [ROLES.SUPERADMIN],
    '/riwayat': [ROLES.SUPERADMIN],
    '/staff': [ROLES.SUPERADMIN],
    '/ruangan': [ROLES.SUPERADMIN],

    // User Routes
    '/u/riwayat': [ROLES.PEMINJAM],

};