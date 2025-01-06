const { encryptPassword } = require('../utils/bcrypt');
const {logger} = require('../apps/logging')

async function penggunaSeeder(prisma) {
    try {
        logger.info('Starting pengguna seeder...');

        const existingSuperadmin = await prisma.pengguna.findFirst({
            where: {
                role: 'SUPERADMIN'
            }
        });

        if (!existingSuperadmin) {
            const hashedPassword = await encryptPassword('@Test123!');
            
            const superAdmin = await prisma.pengguna.create({
                data: {
                    nama_lengkap: 'Super Admin',
                    email: 'superadmin.pusdatin@adminkkp.id',
                    kata_sandi: hashedPassword,
                    role: 'SUPERADMIN',
                }
            });

            logger.info('SUPERADMIN created:', {
                id: superAdmin.id,
                email: superAdmin.email,
                role: superAdmin.role
            });
        } else {
            logger.info('SUPERADMIN already exists, skipping...');
        }

      
        logger.info('Pengguna seeding completed!');
    } catch (error) {
        logger.info('Error in pengguna seeder:', error);
        throw error;
    }
}

if (require.main === module) {
    const prisma = new PrismaClient();
    penggunaSeeder(prisma)
        .catch((err) => {
            logger.info('Failed to seed pengguna:', err);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}

module.exports = { penggunaSeeder };