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
        if ((userData.role === 'PEMINJAM'|| userData.role === 'ADMIN') && userData.tim_kerja_id) {
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

            if (userData.role === 'PEMINJAM' || userData.role === 'ADMIN') {
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

        // Cek role admin/superadmin yang sudah ada
        if (userData.role && (userData.role === 'ADMIN' || userData.role === 'SUPERADMIN')) {
            const existingRole = await prisma.pengguna.findFirst({
                where: {
                    role: userData.role,
                    NOT: { id: userId }
                }
            });

            if (existingRole) {
                throw new ResponseError(400, `Another user with role ${userData.role} already exists`);
            }
        }

        // Cek tim kerja jika ada perubahan tim_kerja_id
        if (userData.tim_kerja_id && userData.tim_kerja_id !== user.DetailPengguna?.tim_kerja_id) {
            const existingTeamAccount = await prisma.detailPengguna.findFirst({
                where: {
                    tim_kerja_id: userData.tim_kerja_id,
                    NOT: { pengguna_id: userId }
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

        const result = await prisma.$transaction(async (prisma) => {
            const updatedUser = await prisma.pengguna.update({
                where: { id: userId },
                data: {
                    nama_lengkap: userData.nama_lengkap || user.nama_lengkap,
                    email: userData.email || user.email,
                    role: userData.role || user.role,
                }
            });

            if (updatedUser.role === 'PEMINJAM' || userData.role === 'ADMIN') {
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
                    if (userData.tim_kerja_id) {
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
                token: true 
            }
        });
    
        if (!user) {
            throw new ResponseError(404, "User not found");
        }
    
        if (user.role === 'SUPERADMIN') {
            throw new ResponseError(400, "Cannot delete SUPERADMIN account");
        }
    
        const activePeminjaman = user.Peminjaman.some(
            peminjaman => ['DIPROSES', 'DISETUJUI'].includes(peminjaman.status)
        );
    
        if (activePeminjaman) {
            throw new ResponseError(400, "Cannot delete user with active loans");
        }
    
        await prisma.$transaction(async (prisma) => {
            // Delete DetailPengguna jika ada
            if (user.DetailPengguna) {
                await prisma.detailPengguna.delete({
                    where: { pengguna_id: userId }
                });
            }
    
            // Delete token jika ada (menggunakan huruf kecil)
            if (user.token.length > 0) {
                await prisma.token.deleteMany({
                    where: { pengguna_id: userId }
                });
            }
    
            // Delete peminjaman yang sudah selesai/ditolak
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
    
            // Delete user
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
    },

    async getAllUser() {
        try {
            const users = await prisma.pengguna.findMany({
                where: {
                    role: {
                        in: ['ADMIN', 'PEMINJAM']
                    }
                },
                include: {
                    DetailPengguna: {
                        include: {
                            tim_kerja: true 
                        }
                    }
                }
                
            });
    
            if (!users || users.length === 0) {
                throw new ResponseError(404, 'No users found');
            }
    
            const formattedUsers = users.map(user => ({
                id: user.id,
                nama_lengkap: user.nama_lengkap,
                email: user.email,
                role: user.role,
                detail: user.DetailPengguna ? {
                    kontak: user.DetailPengguna.kontak,
                    tim_kerja: user.DetailPengguna.tim_kerja.nama_tim_kerja
                } : null
            }));
    
            return {
                status: 200,
                data: formattedUsers
            };
        } catch (error) {
            if (error instanceof ResponseError) {
                throw error;
            }
            throw new ResponseError(500, 'An error occurred while fetching users');
        }
    }
};

module.exports = authService;