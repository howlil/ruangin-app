import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-200 last:border-0">
            <button
                className="w-full py-4 px-6 flex justify-between items-center hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span className="text-left font-medium text-gray-900">{question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ease-out ${isOpen ? 'transform rotate-180' : ''
                        }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-200 ease-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-6 pt-0 text-gray-600 whitespace-pre-line">
                    {answer}
                </div>
            </div>
        </div>
    );
};

const CustomAccordion = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqData = [
        {
            question: "Bagaimana cara melakukan peminjaman ruangan?",
            answer: "Untuk melakukan peminjaman ruangan, ikuti langkah berikut:\n1. Login ke akun Anda\n2. Pilih menu 'Pinjam Ruangan'\n3. Pilih ruangan yang tersedia\n4. Isi formulir peminjaman (tanggal, waktu, keperluan)\n5. Tunggu persetujuan dari admin"
        },
        {
            question: "Berapa lama proses persetujuan peminjaman?",
            answer: "Proses persetujuan peminjaman ruangan biasanya memakan waktu 1-2 hari kerja. Anda akan mendapatkan notifikasi melalui email dan sistem ketika peminjaman sudah disetujui atau ditolak."
        },
        {
            question: "Apakah bisa membatalkan peminjaman ruangan?",
            answer: "Ya, Anda dapat membatalkan peminjaman ruangan minimal 24 jam sebelum waktu penggunaan. Caranya:\n1. Masuk ke menu 'Riwayat Peminjaman'\n2. Pilih peminjaman yang ingin dibatalkan\n3. Klik tombol 'Batalkan' dan isi alasan pembatalan"
        },
        {
            question: "Apa saja fasilitas yang tersedia di ruangan?",
            answer: "Setiap ruangan memiliki fasilitas standar seperti:\n- Meja dan kursi\n- Proyektor dan layar\n- Papan tulis\n- AC\n- Wifi\nUntuk fasilitas spesifik, Anda dapat melihat detail pada masing-masing ruangan."
        },
        {
            question: "Berapa lama maksimal waktu peminjaman?",
            answer: "Waktu maksimal peminjaman ruangan adalah 8 jam per hari. Untuk peminjaman lebih dari 1 hari, diperlukan persetujuan khusus dari manajemen."
        }
    ];

    const handleClick = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Frequently Asked Questions
                </h2>
                <p className="text-gray-600">
                    Temukan jawaban untuk pertanyaan yang sering diajukan tentang peminjaman ruangan
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {faqData.map((faq, index) => (
                    <AccordionItem
                        key={index}
                        question={faq.question}
                        answer={faq.answer}
                        isOpen={openIndex === index}
                        onClick={() => handleClick(index)}
                    />
                ))}
            </div>


        </div>
    );
};

export default CustomAccordion;