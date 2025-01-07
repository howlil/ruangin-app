const { ResponseError } = require('../utils/responseError');
const { generateToken } = require('../utils/jwt');
const { checkPassword, encryptPassword } = require('../utils/bcrypt');
const prisma = require('../configs/db.js')


const authService = {
    async login(email, password) {
        const user = await prisma.pengguna.findFirst({
            where: { email },
            include: {
                DetailPengguna: {
                    include: {
                        tim_kerja: true
                    }
                }
            }
        });

        if (!user) {
            throw new ResponseError(404, "User not found");
        }

        const isPasswordValid = await checkPassword(password, user.kata_sandi);
        if (!isPasswordValid) {
            throw new ResponseError(401, "Wrong password");
        }

        const token = generateToken(user.id);

        await prisma.token.create({
            data: {
                token,
                pengguna_id: user.id
            }
        });

        return {
            id: user.id,
            nama_lengkap: user.nama_lengkap,
            email: user.email,
            role: user.role,
            detail_pengguna: user.DetailPengguna,
            token
        };
    },

    async register(userData) {
        const existingUser = await prisma.pengguna.findFirst({
            where: { email: userData.email }
        });
    
        if (existingUser) {
            throw new ResponseError(400, "Email already registered");
        }
    
        // Cek role admin/superadmin
        if (userData.role === 'ADMIN' || userData.role === 'SUPERADMIN') {
            const existingRole = await prisma.pengguna.findFirst({
                where: { role: userData.role }
            });
    
            if (existingRole) {
                throw new ResponseError(400, `User with role ${userData.role} already exists`);
            }
        }
    
        // Cek jika role PEMINJAM dan memastikan tim kerja belum memiliki akun
        if (userData.role === 'PEMINJAM' && userData.tim_kerja_id) {
            const existingTeamAccount = await prisma.detailPengguna.findFirst({
                where: { 
                    tim_kerja_id: userData.tim_kerja_id 
                },
                include: {
                    Pengguna: {
                        select: {
                            email: true
                        }
                    }
                }
            });
    
            if (existingTeamAccount?.Pengguna) {
                throw new ResponseError(400, `Tim kerja ini sudah memiliki akun terdaftar dengan email: ${existingTeamAccount.Pengguna.email}`);
            }
        }
    
        const defaultPassword = "@Test123!";
        const hashedPassword = await encryptPassword(defaultPassword);
    
        const result = await prisma.$transaction(async (prisma) => {
            const user = await prisma.pengguna.create({
                data: {
                    nama_lengkap: userData.nama_lengkap,
                    email: userData.email,
                    kata_sandi: hashedPassword,
                    role: userData.role,
                }
            });
    
            if (userData.role === 'PEMINJAM') {
                await prisma.detailPengguna.create({
                    data: {
                        pengguna_id: user.id,
                        kontak: userData.kontak,
                        tim_kerja_id: userData.tim_kerja_id,
                    }
                });
            }
    
            return user;
        });
    
        return {
            id: result.id,
            nama_lengkap: result.nama_lengkap,
            email: result.email,
            role: result.role
        };
    },

    async updateUser(userId, userData) {
        const user = await prisma.pengguna.findUnique({
            where: { id: userId },
            include: { DetailPengguna: true }
        });

        if (!user) {
            throw new ResponseError(404, "User not found");
        }

        if (userData.role && (userData.role === 'ADMIN' || userData.role === 'SUPERADMIN')) {
            const existingRole = await prisma.pengguna.findFirst({
                where: {
                    role: userData.role,
                    NOT: { id: userId } // Exclude current user
                }
            });

            if (existingRole) {
                throw new ResponseError(400, `Another user with role ${userData.role} already exists`);
            }
        }

        const result = await prisma.$transaction(async (prisma) => {
            const updatedUser = await prisma.pengguna.update({
                where: { id: userId },
                data: {
                    nama_lengkap: userData.nama_lengkap || user.nama_lengkap,
                    email: userData.email || user.email,
                    role: userData.role || user.role,
                }
            });

            if (updatedUser.role === 'PEMINJAM') {
                if (user.DetailPengguna) {
                    if (userData.kontak || userData.tim_kerja_id) {
                        await prisma.detailPengguna.update({
                            where: { pengguna_id: userId },
                            data: {
                                kontak: userData.kontak || user.DetailPengguna.kontak,
                                tim_kerja_id: userData.tim_kerja_id || user.DetailPengguna.tim_kerja_id,
                            }
                        });
                    }
                } else {
                    await prisma.detailPengguna.create({
                        data: {
                            pengguna_id: userId,
                            kontak: userData.kontak,
                            tim_kerja_id: userData.tim_kerja_id,
                        }
                    });
                }
            } else if (user.DetailPengguna) {
                await prisma.detailPengguna.delete({
                    where: { pengguna_id: userId }
                });
            }

            return updatedUser;
        });

        return {
            id: result.id,
            nama_lengkap: result.nama_lengkap,
            email: result.email,
            role: result.role
        };
    },

    async deleteUser(userId) {
        const user = await prisma.pengguna.findUnique({
            where: { id: userId },
            include: {
                DetailPengguna: true,
                Peminjaman: true,
                Token: true
            }
        });

        if (!user) {
            throw new ResponseError(404, "User not found");
        }

        if (user.role === 'SUPERADMIN' || user.role === 'ADMIN') {
            throw new ResponseError(400, "Cannot delete SUPERADMIN or ADMIN account");
        }

        const activePeminjaman = user.Peminjaman.some(
            peminjaman => ['DIPROSES', 'DISETUJUI'].includes(peminjaman.status)
        );

        if (activePeminjaman) {
            throw new ResponseError(400, "Cannot delete user with active loans");
        }

        await prisma.$transaction(async (prisma) => {
            if (user.DetailPengguna) {
                await prisma.detailPengguna.delete({
                    where: { pengguna_id: userId }
                });
            }

            if (user.Token.length > 0) {
                await prisma.token.deleteMany({
                    where: { pengguna_id: userId }
                });
            }

            if (user.Peminjaman.length > 0) {
                await prisma.peminjaman.deleteMany({
                    where: {
                        pengguna_id: userId,
                        status: {
                            in: ['DITOLAK', 'SELESAI']
                        }
                    }
                });
            }

            await prisma.pengguna.delete({
                where: { id: userId }
            });
        });

        return {
            status: true,
            message: "User successfully deleted"
        };
    }
    ,
    async logout(token) {
        await prisma.token.deleteMany({
            where: { token }
        });
    }
};

module.exports = authService;