const prisma = require('../configs/db.js')
const { ResponseError } = require('../utils/responseError');
const moment = require('moment')
const PDFDocument = require ('pdfkit');

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

        // const currentTime = moment();
        // const meetingStart = moment(`${peminjaman.tanggal_mulai} ${peminjaman.jam_mulai}`);
        // const meetingEnd = moment(`${peminjaman.tanggal_mulai} ${peminjaman.jam_selesai}`);

        // if (currentTime.isBefore(meetingStart)) {
        //     throw new ResponseError(400, "Meeting hasn't started yet");
        // }

        // if (currentTime.isAfter(meetingEnd)) {
        //     throw new ResponseError(400, "Meeting has ended");
        // }

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

    // async exportAbsensiToPdf(kode) {
    //     const absensi = await prisma.absensi.findFirst({
    //         where: {
    //             link_absensi: {
    //                 contains: kode
    //             }
    //         },
    //         include: {
    //             ListAbsensi: true,
    //             Peminjaman: {
    //                 include: {
    //                     RuangRapat: true
    //                 }
    //             }
    //         }
    //     });

    //     if (!absensi) {
    //         throw new ResponseError(404, "Absensi not found");
    //     }

    //     // Create PDF document
    //     const doc = new PDFDocument({
    //         size: 'A4',
    //         margin: 50,
    //         bufferPages: true
    //     });

    //     // Helper function to add page numbers
    //     let pageNumber = 1;
    //     doc.on('pageAdded', () => {
    //         pageNumber++;
    //     });

    //     // Set font
    //     doc.font('Helvetica-Bold');
        
    //     // Add header
    //     doc.fontSize(16).text('DAFTAR HADIR RAPAT', { align: 'center' });
    //     doc.moveDown();

    //     // Add meeting details
    //     doc.fontSize(12);
    //     doc.text(`Hari / Tanggal    : ${formatDate(absensi.Peminjaman.tanggal_mulai)}`);
    //     doc.text(`Nama Acara        : ${absensi.Peminjaman.nama_kegiatan}`);
    //     doc.text(`Tempat            : ${absensi.Peminjaman.RuangRapat.nama_ruangan}`);
    //     doc.text(`Waktu             : ${absensi.Peminjaman.jam_mulai} - ${absensi.Peminjaman.jam_selesai}`);
    //     doc.moveDown();

    //     // Table configuration
    //     const tableTop = 200;
    //     const tableHeaders = ['No', 'Nama', 'Unit Kerja', 'Golongan', 'Jabatan', 'Jenis Kelamin', 'Tanda Tangan'];
    //     const colWidths = [30, 100, 80, 60, 80, 80, 80]; // Adjusted column widths
    //     const rowHeight = 40;

    //     // Draw table headers
    //     let xPos = 50;
    //     doc.font('Helvetica-Bold');
        
    //     tableHeaders.forEach((header, i) => {
    //         doc.text(header, xPos, tableTop, {
    //             width: colWidths[i],
    //             align: 'left'
    //         });
    //         xPos += colWidths[i];
    //     });

    //     // Draw horizontal line after headers
    //     doc.moveTo(50, tableTop + 20)
    //        .lineTo(550, tableTop + 20)
    //        .stroke();

    //     // Draw table content
    //     doc.font('Helvetica');
    //     let yPos = tableTop + 30;

    //     for (let i = 0; i < absensi.ListAbsensi.length; i++) {
    //         const peserta = absensi.ListAbsensi[i];
            
    //         // Check if we need a new page
    //         if (yPos > 700) {
    //             doc.addPage();
    //             yPos = 50;
                
    //             // Redraw headers on new page
    //             xPos = 50;
    //             doc.font('Helvetica-Bold');
    //             tableHeaders.forEach((header, j) => {
    //                 doc.text(header, xPos, yPos, {
    //                     width: colWidths[j],
    //                     align: 'left'
    //                 });
    //                 xPos += colWidths[j];
    //             });
    //             doc.moveTo(50, yPos + 20)
    //                .lineTo(550, yPos + 20)
    //                .stroke();
    //             doc.font('Helvetica');
    //             yPos += 30;
    //         }

    //         // Reset x position for each row
    //         xPos = 50;
            
    //         // Draw table cells
    //         doc.text(String(i + 1), xPos, yPos, { width: colWidths[0] });
    //         xPos += colWidths[0];
            
    //         doc.text(peserta.nama, xPos, yPos, { width: colWidths[1] });
    //         xPos += colWidths[1];
            
    //         doc.text(peserta.unit_kerja, xPos, yPos, { width: colWidths[2] });
    //         xPos += colWidths[2];
            
    //         doc.text(peserta.golongan, xPos, yPos, { width: colWidths[3] });
    //         xPos += colWidths[3];
            
    //         doc.text(peserta.jabatan, xPos, yPos, { width: colWidths[4] });
    //         xPos += colWidths[4];
            
    //         doc.text(peserta.jenis_kelamin, xPos, yPos, { width: colWidths[5] });
    //         xPos += colWidths[5];

    //         // Handle tanda tangan (signature)
    //         try {
    //             if (peserta.tanda_tangan && peserta.tanda_tangan.startsWith('data:image/')) {
    //                 // Extract image type and base64 data
    //                 const matches = peserta.tanda_tangan.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
                    
    //                 if (matches && matches.length === 3) {
    //                     const imageBuffer = Buffer.from(matches[2], 'base64');
                        
    //                     try {
    //                         doc.image(imageBuffer, xPos, yPos - 10, {
    //                             fit: [60, 30],
    //                             align: 'center',
    //                             valign: 'center'
    //                         });
    //                     } catch (imgError) {
    //                         // If image fails to load, just show placeholder text
    //                         doc.text('[Tanda Tangan]', xPos, yPos, {
    //                             width: colWidths[6],
    //                             align: 'center'
    //                         });
    //                         console.error('Error loading signature image:', imgError);
    //                     }
    //                 }
    //             }
    //         } catch (error) {
    //             console.error('Error processing signature:', error);
    //             doc.text('[Tanda Tangan]', xPos, yPos, {
    //                 width: colWidths[6],
    //                 align: 'center'
    //             });
    //         }

    //         // Draw horizontal line after each row
    //         doc.moveTo(50, yPos + rowHeight - 10)
    //            .lineTo(550, yPos + rowHeight - 10)
    //            .stroke();

    //         yPos += rowHeight;
    //     }

    //     // Add page numbers
    //     let pages = doc.bufferedPageRange();
    //     for (let i = 0; i < pages.count; i++) {
    //         doc.switchToPage(i);
    //         doc.fontSize(8);
    //         doc.text(
    //             `Halaman ${i + 1} dari ${pages.count}`,
    //             50,
    //             doc.page.height - 50,
    //             { align: 'center' }
    //         );
    //     }

    //     return doc;
    // }

    // async exportAbsensiToPdf(kode) {
    //     const absensi = await prisma.absensi.findFirst({
    //         where: {
    //             link_absensi: {
    //                 contains: kode
    //             }
    //         },
    //         include: {
    //             ListAbsensi: true,
    //             Peminjaman: {
    //                 include: {
    //                     RuangRapat: true
    //                 }
    //             }
    //         }
    //     });

    //     if (!absensi) {
    //         throw new ResponseError(404, "Absensi not found");
    //     }

    //     // Create PDF document
    //     const doc = new PDFDocument({
    //         size: 'A4',
    //         margin: 40,
    //         bufferPages: true
    //     });

    //     // Helper function to add page numbers
    //     let pageNumber = 1;
    //     doc.on('pageAdded', () => {
    //         pageNumber++;
    //     });

    //     // Set font
    //     doc.font('Helvetica-Bold');
        
    //     // Add header
    //     doc.fontSize(16).text('DAFTAR HADIR RAPAT', { align: 'center' });
    //     doc.moveDown(1.2);

    //     // Add meeting details with proper spacing
    //     doc.fontSize(11);
        
    //     // Define consistent spacing
    //     const labelWidth = 120;
    //     const currentX = 60;
    //     let currentY = 120; // Adjusted starting position
        
    //     // Helper function for detail line
    //     const addDetailLine = (label, value) => {
    //         doc.font('Helvetica-Bold')
    //            .text(label, currentX, currentY, { continued: true })
               
    //            .text(' : ', { continued: true })
    //            .font('Helvetica')
    //            .text(value);
    //         return currentY += 25; // Consistent line spacing
    //     };

    //     // Add details with consistent spacing
    //     currentY = addDetailLine('Hari / Tanggal', formatDate(absensi.Peminjaman.tanggal_mulai));
    //     currentY = addDetailLine('Nama Acara', absensi.Peminjaman.nama_kegiatan);
    //     currentY = addDetailLine('Tempat', absensi.Peminjaman.RuangRapat.nama_ruangan);
    //     currentY = addDetailLine('Waktu', `${absensi.Peminjaman.jam_mulai} - ${absensi.Peminjaman.jam_selesai}`);
        
    //     doc.moveDown(1);

    //     // Table configuration
    //     const tableTop = currentY + 20;
    //     const tableHeaders = ['No', 'Nama', 'Unit Kerja', 'Golongan', 'Jabatan', 'L/P', 'Tanda Tangan'];
    //     const colWidths = [30, 100, 80, 70, 80, 40, 100];
    //     const rowHeight = 70; // Increased for larger signatures

    //     // Set lighter line width for table
    //     doc.lineWidth(0.3);

    //     // Draw header row
    //     doc.font('Helvetica-Bold');
    //     let xPos = 40;
        
    //     // Draw header cells
    //     tableHeaders.forEach((header, i) => {
    //         doc.rect(xPos, tableTop, colWidths[i], 30).stroke();
    //         doc.text(header, xPos + 5, tableTop + 10, {
    //             width: colWidths[i] - 10,
    //             align: 'center'
    //         });
    //         xPos += colWidths[i];
    //     });

    //     // Draw table content
    //     doc.font('Helvetica');
    //     currentY = tableTop + 30;

    //     for (let i = 0; i < absensi.ListAbsensi.length; i++) {
    //         const peserta = absensi.ListAbsensi[i];
            
    //         if (currentY > 700) {
    //             doc.addPage();
    //             currentY = 50;
                
    //             xPos = 40;
    //             doc.font('Helvetica-Bold');
    //             tableHeaders.forEach((header, j) => {
    //                 doc.rect(xPos, currentY, colWidths[j], 30).stroke();
    //                 doc.text(header, xPos + 5, currentY + 10, {
    //                     width: colWidths[j] - 10,
    //                     align: 'center'
    //                 });
    //                 xPos += colWidths[j];
    //             });
    //             doc.font('Helvetica');
    //             currentY += 30;
    //         }

    //         xPos = 40;
            
    //         // Draw row cells
    //         const drawCell = (content, width, align = 'left') => {
    //             doc.rect(xPos, currentY, width, rowHeight).stroke();
    //             doc.text(content, xPos + 5, currentY + (rowHeight/2 - 7), {
    //                 width: width - 10,
    //                 align: align
    //             });
    //             xPos += width;
    //         };

    //         // Draw each cell
    //         drawCell(String(i + 1), colWidths[0], 'center');
    //         drawCell(peserta.nama, colWidths[1]);
    //         drawCell(peserta.unit_kerja, colWidths[2]);
    //         drawCell(peserta.golongan, colWidths[3]);
    //         drawCell(peserta.jabatan, colWidths[4]);
    //         drawCell(peserta.jenis_kelamin === 'LAKI_LAKI' ? 'L' : 'P', colWidths[5], 'center');

    //         // Handle signature with larger dimensions
    //         doc.rect(xPos, currentY, colWidths[6], rowHeight).stroke();
    //         if (peserta.tanda_tangan && peserta.tanda_tangan.startsWith('data:image/')) {
    //             try {
    //                 const base64Data = peserta.tanda_tangan.split(',')[1];
    //                 if (base64Data) {
    //                     const buffer = Buffer.from(base64Data, 'base64');
    //                     try {
    //                         // Larger signature dimensions
    //                         doc.image(buffer, xPos + 10, currentY + 5, {
    //                             width: 90,  // Increased width
    //                             height: 60  // Increased height
    //                         });
    //                     } catch (err) {
    //                         doc.text('[Tanda Tangan]', xPos + 5, currentY + (rowHeight/2 - 7), {
    //                             width: colWidths[6] - 10,
    //                             align: 'center'
    //                         });
    //                     }
    //                 }
    //             } catch (error) {
    //                 doc.text('[Tanda Tangan]', xPos + 5, currentY + (rowHeight/2 - 7), {
    //                     width: colWidths[6] - 10,
    //                     align: 'center'
    //                 });
    //             }
    //         }

    //         currentY += rowHeight;
    //     }

    //     // Add page numbers
    //     let pages = doc.bufferedPageRange();
    //     for (let i = 0; i < pages.count; i++) {
    //         doc.switchToPage(i);
    //         doc.fontSize(8);
    //         doc.text(
    //             `Halaman ${i + 1} dari ${pages.count}`,
    //             40,
    //             doc.page.height - 50,
    //             { align: 'center' }
    //         );
    //     }

    //     return doc;
    // }
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
            const labelWidth = 120; // Increased width for labels
            const colonX = startX + labelWidth; // Fixed position for colons
            const contentX = colonX + 20; // Fixed position for content
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
        
            // Rest of the code remains the same...
            doc.moveDown(1);

           
            // Table configuration
            const tableTop = currentY + 20;
            const tableHeaders = ['No', 'Nama', 'Unit Kerja', 'Golongan', 'Jabatan', 'L/P', 'Tanda Tangan'];
            const colWidths = [30, 100, 80, 70, 80, 40, 100];
            const rowHeight = 70; // Increased for larger signatures

            // Set lighter line width for table
            doc.lineWidth(0.1);

            // Draw header row
            doc.font('Helvetica-Bold');
            let xPos = 40;
            
            // Draw header cells
            tableHeaders.forEach((header, i) => {
                doc.rect(xPos, tableTop, colWidths[i], 30).stroke();
                doc.text(header, xPos + 5, tableTop + 10, {
                    width: colWidths[i] - 10,
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
                        doc.text(header, xPos + 5, currentY + 10, {
                            width: colWidths[j] - 10,
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
                    doc.text(content, xPos + 5, currentY + (rowHeight/2 - 7), {
                        width: width - 10,
                        align: align
                    });
                    xPos += width;
                };

                // Draw each cell
                drawCell(String(i + 1), colWidths[0], 'center');
                drawCell(peserta.nama, colWidths[1]);
                drawCell(peserta.unit_kerja, colWidths[2]);
                drawCell(peserta.golongan, colWidths[3]);
                drawCell(peserta.jabatan, colWidths[4]);
                drawCell(peserta.jenis_kelamin === 'LAKI_LAKI' ? 'L' : 'P', colWidths[5], 'center');

                // Handle signature with larger dimensions
                doc.rect(xPos, currentY, colWidths[6], rowHeight).stroke();
                if (peserta.tanda_tangan && peserta.tanda_tangan.startsWith('data:image/')) {
                    try {
                        const base64Data = peserta.tanda_tangan.split(',')[1];
                        if (base64Data) {
                            const buffer = Buffer.from(base64Data, 'base64');
                            try {
                                // Larger signature dimensions
                                doc.image(buffer, xPos + 10, currentY + 5, {
                                    width: 160,  // Increased width
                                    height: 100  // Increased height
                                });
                            } catch (err) {
                                doc.text('[Tanda Tangan]', xPos + 5, currentY + (rowHeight/2 - 7), {
                                    width: colWidths[6] - 10,
                                    align: 'center'
                                });
                            }
                        }
                    } catch (error) {
                        doc.text('[Tanda Tangan]', xPos + 5, currentY + (rowHeight/2 - 7), {
                            width: colWidths[6] - 10,
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
        }
}

module.exports = absensiService