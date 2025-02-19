const prisma = require('../configs/db.js')
const { ResponseError } = require('../utils/responseError');
const moment = require('moment')
const PDFDocument = require('pdfkit');
const ExcelJS = require('ExcelJS')


function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString('id-ID', options);
}

function createSlug(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

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
            throw new ResponseError(400, "Meeting Belum Dimulai");
        }

        if (currentTime.isAfter(meetingEnd)) {
            throw new ResponseError(400, "Meeting Sudah selesai`");
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


    async exportAbsensiToPdf(kode) {
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
    
        // Create PDF document
        const doc = new PDFDocument({
            size: 'A4',
            margin: 40,
            bufferPages: true
        });
    
        // Helper function to add page numbers
        let pageNumber = 1;
        doc.on('pageAdded', () => {
            pageNumber++;
        });
    
        // Set font
        doc.font('Helvetica-Bold');
    
        // Add header
        doc.fontSize(16).text('DAFTAR HADIR RAPAT', { align: 'center' });
        doc.moveDown(1.5);
    
        // Add meeting details with proper spacing
        doc.fontSize(11);
    
        // Define consistent spacing
        const startX = 40;
        const labelWidth = 120;
        const colonX = startX + labelWidth;
        const contentX = colonX + 20;
        let currentY = 120;
    
        // Helper function for aligned detail lines
        const addDetailLine = (label, value) => {
            doc.font('Helvetica-Bold')
                .text(label, startX, currentY)
                .text(':', colonX, currentY)
                .font('Helvetica')
                .text(value, contentX, currentY);
            return currentY += 25;
        };
    
        // Add details with consistent spacing and alignment
        currentY = addDetailLine('Hari / Tanggal', formatDate(absensi.Peminjaman.tanggal_mulai));
        currentY = addDetailLine('Nama Acara', absensi.Peminjaman.nama_kegiatan);
        currentY = addDetailLine('Tempat', absensi.Peminjaman.RuangRapat.nama_ruangan);
        currentY = addDetailLine('Waktu', `${absensi.Peminjaman.jam_mulai} - ${absensi.Peminjaman.jam_selesai}`);
    
        doc.moveDown(1);
    
        // Table configuration dengan penyesuaian ukuran yang lebih presisi
        const tableTop = currentY + 20;
        const tableHeaders = ['No', 'Nama', 'Unit Kerja', 'Golongan', 'Jabatan', 'L/P', 'Tanda Tangan'];
        // Perbaikan: Sesuaikan colWidths dengan jumlah kolom yang benar
        const colWidths = [30, 100, 80, 60, 70, 30, 90]; // Total 7 kolom
        const rowHeight = 40;
    
        // Set lighter line width for table
        doc.lineWidth(0.5);
    
        // Draw header row
        doc.font('Helvetica-Bold');
        let xPos = 40;
    
        // Draw header cells
        tableHeaders.forEach((header, i) => {
            doc.rect(xPos, tableTop, colWidths[i], 30).stroke();
            doc.text(header, xPos + 2, tableTop + 10, {
                width: colWidths[i] - 4,
                align: 'center'
            });
            xPos += colWidths[i];
        });
    
        // Draw table content
        doc.font('Helvetica');
        currentY = tableTop + 30;
    
        for (let i = 0; i < absensi.ListAbsensi.length; i++) {
            const peserta = absensi.ListAbsensi[i];
    
            if (currentY > 700) {
                doc.addPage();
                currentY = 50;
    
                xPos = 40;
                doc.font('Helvetica-Bold');
                tableHeaders.forEach((header, j) => {
                    doc.rect(xPos, currentY, colWidths[j], 30).stroke();
                    doc.text(header, xPos + 2, currentY + 10, {
                        width: colWidths[j] - 4,
                        align: 'center'
                    });
                    xPos += colWidths[j];
                });
                doc.font('Helvetica');
                currentY += 30;
            }
    
            xPos = 40;
    
            // Draw row cells
            const drawCell = (content, width, align = 'left') => {
                doc.rect(xPos, currentY, width, rowHeight).stroke();
                doc.text(String(content || '-'), xPos + 2, currentY + (rowHeight / 2 - 5), {
                    width: width - 4,
                    align: align
                });
                xPos += width;
            };
    
            // Draw each cell dengan indeks yang benar
            drawCell(i + 1, colWidths[0], 'center');
            drawCell(peserta.nama, colWidths[1]);
            drawCell(peserta.unit_kerja, colWidths[2]);
            drawCell(peserta.golongan, colWidths[3]);
            drawCell(peserta.jabatan, colWidths[4]);
            drawCell(peserta.jenis_kelamin === 'LAKI_LAKI' ? 'L' : 'P', colWidths[5], 'center');
    
            // Handle signature
            doc.rect(xPos, currentY, colWidths[6], rowHeight).stroke();
            if (peserta.tanda_tangan && peserta.tanda_tangan.startsWith('data:image/')) {
                try {
                    const base64Data = peserta.tanda_tangan.split(',')[1];
                    if (base64Data) {
                        const buffer = Buffer.from(base64Data, 'base64');
                        try {
                            const signatureWidth = colWidths[6] - 20;
                            const signatureHeight = rowHeight - 10;
                            const centerX = xPos + (colWidths[6] - signatureWidth) / 2;
                            const centerY = currentY + (rowHeight - signatureHeight) / 2;
    
                            doc.image(buffer, centerX, centerY, {
                                width: signatureWidth,
                                height: signatureHeight,
                                fit: [signatureWidth, signatureHeight],
                                align: 'center',
                                valign: 'center'
                            });
                        } catch (err) {
                            doc.text('[Tanda Tangan]', xPos, currentY + (rowHeight / 2 - 5), {
                                width: colWidths[6],
                                align: 'center'
                            });
                        }
                    }
                } catch (error) {
                    doc.text('[Tanda Tangan]', xPos, currentY + (rowHeight / 2 - 5), {
                        width: colWidths[6],
                        align: 'center'
                    });
                }
            }
    
            currentY += rowHeight;
        }
    
        // Add page numbers
        let pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
            doc.switchToPage(i);
            doc.fontSize(8);
            doc.text(
                `Halaman ${i + 1} dari ${pages.count}`,
                40,
                doc.page.height - 50,
                { align: 'center' }
            );
        }
    
        return doc;
    },
    async exportAbsensiToXlsx(kode) {
        try {
            // 1. Validasi input
            if (!kode) {
                throw new ResponseError(400, "Kode absensi diperlukan");
            }
    
            // 2. Ambil data absensi
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
    
            // 3. Validasi keberadaan data
            if (!absensi) {
                throw new ResponseError(404, "Absensi tidak ditemukan");
            }
    
            // 4. Buat workbook dan worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Daftar Hadir Rapat');
    
            // 5. Set column widths
            const columns = [
                { header: 'No', key: 'no', width: 15 },
                { header: 'Nama', key: 'nama', width: 30 },
                { header: 'No HP', key: 'kontak', width: 15 },
                { header: 'Unit Kerja', key: 'unit_kerja', width: 20 },
                { header: 'Golongan', key: 'golongan', width: 15 },
                { header: 'Jabatan', key: 'jabatan', width: 20 },
                { header: 'L/P', key: 'jenis_kelamin', width: 8 }
            ];
            
            worksheet.columns = columns;
    
            // 6. Add title
            worksheet.mergeCells('A1:G1');
            const titleCell = worksheet.getCell('A1');
            titleCell.value = 'DAFTAR HADIR RAPAT';
            titleCell.font = { bold: true, size: 16 };
            titleCell.alignment = { horizontal: 'center' };
    
            // 7. Add meeting details dengan safe access
            const details = [
                ['Hari / Tanggal ',  formatDate(absensi.Peminjaman?.tanggal_mulai) || '-'],
                ['Nama Acara ',  absensi.Peminjaman?.nama_kegiatan || '-'],
                ['Tempat ',  absensi.Peminjaman?.RuangRapat?.nama_ruangan || '-'],
                ['Waktu ', `${absensi.Peminjaman?.jam_mulai || '-'} - ${absensi.Peminjaman?.jam_selesai || '-'}`]
            ];
    
            // 8. Add details to worksheet
            let currentRow = 3;
            details.forEach(detail => {
                worksheet.getCell(`A${currentRow}`).value = detail[0];
                worksheet.getCell(`B${currentRow}`).value = detail[1];
                worksheet.mergeCells(`C${currentRow}:G${currentRow}`);
                worksheet.getCell(`C${currentRow}`).value = detail[2];
                currentRow++;
            });
    
            // 9. Add and style header row
            currentRow += 2;
            
            // Add headers manually
            for (let i = 0; i < columns.length; i++) {
                const cell = worksheet.getCell(currentRow, i + 1);
                cell.value = columns[i].header;
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFD3D3D3' }
                };
                cell.font = { bold: true };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            }
    
            // 10. Add data rows
            currentRow++; // Move to next row for data
            
            if (absensi.ListAbsensi && Array.isArray(absensi.ListAbsensi)) {
                absensi.ListAbsensi.forEach((peserta, index) => {
                    const rowData = {
                        no: index + 1,
                        nama: peserta.nama || '-',
                        kontak: peserta.kontak || '-',
                        unit_kerja: peserta.unit_kerja || '-',
                        golongan: peserta.golongan || '-',
                        jabatan: peserta.jabatan || '-',
                        jenis_kelamin: peserta.jenis_kelamin === 'LAKI_LAKI' ? 'L' : 'P'
                    };
    
                    const row = worksheet.addRow(rowData);
    
                    // Style each cell in the row manually
                    for (let i = 1; i <= columns.length; i++) {
                        const cell = row.getCell(i);
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        cell.alignment = { vertical: 'middle' };
                    }
                });
            }
    
            return workbook;
        } catch (error) {
            console.error('Error in exportAbsensiToXlsx:', error);
            throw error;
        }
    }
}

module.exports = absensiService