const prisma = require('../configs/db.js')
const { ResponseError } = require('../utils/responseError');
const moment = require('moment')

const absensiService = {
    async getAbsensiDetail(kode) {
        const absensi = await prisma.absensi.findFirst({
            where: {
                link_absensi: {
                    contains: kode
                }
            },
            include: {
                Peminjaman: {
                    include: {
                        RuangRapat: true
                    }
                }
            }
        });

        if (!absensi) {
            throw new ResponseError(404, "Absensi not found");
        }

        return {
            peminjaman: {
                nama_kegiatan: absensi.Peminjaman.nama_kegiatan,
                tanggal: absensi.Peminjaman.tanggal_mulai,
                jam_mulai: absensi.Peminjaman.jam_mulai,
                jam_selesai: absensi.Peminjaman.jam_selesai,
                ruang_rapat: absensi.Peminjaman.RuangRapat.nama_ruangan
            },
            id: absensi.id
        };
    },

    async submitAbsensi(kode, absensiData) {
        const absensi = await prisma.absensi.findFirst({
            where: {
                link_absensi: {
                    contains: kode
                }
            }
        });

        if (!absensi) {
            throw new ResponseError(404, "Absensi not found");
        }

        const peminjaman = await prisma.peminjaman.findUnique({
            where: { id: absensi.peminjaman_id }
        });

        const currentTime = moment();
        const meetingStart = moment(`${peminjaman.tanggal_mulai} ${peminjaman.jam_mulai}`);
        const meetingEnd = moment(`${peminjaman.tanggal_mulai} ${peminjaman.jam_selesai}`);

        if (currentTime.isBefore(meetingStart)) {
            throw new ResponseError(400, "Meeting hasn't started yet");
        }

        if (currentTime.isAfter(meetingEnd)) {
            throw new ResponseError(400, "Meeting has ended");
        }

        const listAbsensi = await prisma.listAbsensi.create({
            data: {
                absensi_id: absensi.id,
                ...absensiData
            }
        });

        return listAbsensi;
    },

    async getListAbsensi(kode) {
        const absensi = await prisma.absensi.findFirst({
            where: {
                link_absensi: {
                    contains: kode
                }
            },
            include: {
                ListAbsensi: true,
                Peminjaman: {
                    include: {
                        RuangRapat: true
                    }
                }
            }
        });

        if (!absensi) {
            throw new ResponseError(404, "Absensi not found");
        }

        return {
            peminjaman: {
                nama_kegiatan: absensi.Peminjaman.nama_kegiatan,
                tanggal: absensi.Peminjaman.tanggal_mulai,
                jam_mulai: absensi.Peminjaman.jam_mulai,
                jam_selesai: absensi.Peminjaman.jam_selesai,
                ruang_rapat: absensi.Peminjaman.RuangRapat.nama_ruangan
            },
            list_absensi: absensi.ListAbsensi
        };
    },
}

module.exports = absensiService