const prisma = require("../configs/db")
const dayjs = require("dayjs")
const { logger } = require("../apps/logging")

async function updateStatusPeminjaman() {
    try {
        const now = dayjs()

        // Handle peminjaman yang hanya memiliki tanggal_mulai
        const updateSingleDateBookings = await prisma.peminjaman.updateMany({
            where: {
                AND: [
                    {
                        tanggal_selesai: null, // Hanya yang tidak memiliki tanggal_selesai
                        OR: [
                            {
                                // Kasus 1: Tanggal sudah lewat
                                tanggal_mulai: {
                                    lt: now.format('YYYY-MM-DD')
                                }
                            },
                            {
                                // Kasus 2: Tanggal sama tapi jam sudah lewat
                                AND: [
                                    {
                                        tanggal_mulai: now.format('YYYY-MM-DD')
                                    },
                                    {
                                        jam_selesai: {
                                            lt: now.format('HH:mm')
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

        // Handle peminjaman yang memiliki tanggal_mulai dan tanggal_selesai
        const updateRangeDateBookings = await prisma.peminjaman.updateMany({
            where: {
                AND: [
                    {
                        tanggal_selesai: {
                            not: null
                        },
                        OR: [
                            {
                                // Kasus 1: Tanggal selesai sudah lewat
                                tanggal_selesai: {
                                    lt: now.format('YYYY-MM-DD')
                                }
                            },
                            {
                                // Kasus 2: Di tanggal selesai dan jam sudah lewat
                                AND: [
                                    {
                                        tanggal_selesai: now.format('YYYY-MM-DD')
                                    },
                                    {
                                        jam_selesai: {
                                            lt: now.format('HH:mm')
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

        logger.info(
            `[${now.format('YYYY-MM-DD HH:mm:ss')}] Updated bookings to SELESAI status:
            - Single date bookings: ${updateSingleDateBookings.count}
            - Range date bookings: ${updateRangeDateBookings.count}
            - Total: ${updateSingleDateBookings.count + updateRangeDateBookings.count}`
        );

    } catch (error) {
        logger.error('Error updating booking status:', error);
    }
}

module.exports = { updateStatusPeminjaman }