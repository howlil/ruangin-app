const prisma = require("../configs/db")
const dayjs = require("dayjs")
const { logger } = require("../apps/logging")

async function updateStatusPeminjaman() {
    try {
        const now = dayjs()

        const updatedBookings = await prisma.peminjaman.updateMany({
            where: {
                AND: [
                    {
                        OR: [
                            {
                                tanggal: {
                                    lt: now.format('YYYY-MM-DD')
                                }
                            },
                            {
                                AND: [
                                    {
                                        tanggal: now.format('YYYY-MM-DD'),
                                    },
                                    {
                                        jam_selesai: {
                                            lt: now.subtract(24, 'hour').format('HH:mm')
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        status: 'DISETUJUI'
                    }
                ]
            },
            data: {
                status: 'SELESAI'
            }
        });

        logger.info(`[${now.format('YYYY-MM-DD HH:mm:ss')}] Updated ${updatedBookings.count} bookings to SELESAI status`);

    } catch (error) {
        logger.error('Error updating booking status:', error);
    }
}

module.exports = { updateStatusPeminjaman }