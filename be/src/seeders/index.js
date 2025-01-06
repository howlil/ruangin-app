const prisma = require('../configs/db')
const { penggunaSeeder } = require('./penggunaSeed');

async function main() {
    try {

        await penggunaSeeder(prisma);
    } catch (error) {
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
if (require.main === module) {
    main()
        .catch((err) => {
            console.error('Failed to seed database:', err);
            process.exit(1);
        });
}

module.exports = main;