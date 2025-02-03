import React from 'react';
import { Mail, Phone } from 'lucide-react';

const KKPFooter = () => {
    return (
        <footer className="bg-[#03255c] text-white py-6 w-full">
            <div className=" px-4 md:px-20">
                {/* Header Section */}
                <div className="flex items-center gap-4 mb-6">
                    <img
                        src="https://kkp.go.id/assets/brand/logo.png"
                        alt="Logo KKP"
                        className="w-12 "
                    />
                    <div className="flex items-center gap-2">
                        <img
                            src="https://kkp.go.id/assets/brand/logo_25th.png"
                            alt="25 KKP"
                            className="w-10 "
                        />
                        <div className="flex flex-col">
                            <h2 className="font-bold text-xl">KEMENTERIAN KELAUTAN DAN</h2>
                            <h2 className="font-bold text-xl">PERIKANAN REPUBLIK INDONESIA</h2>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-6">
                    <p className="text-sm">JL. Medan Merdeka Timur No.16 Jakarta Pusat</p>
                    <p className="text-sm flex items-center gap-2">
                        <Phone size={16} /> Telp. (021) 3519070 EXT. 7433 – Fax. (021) 3864293
                    </p>
                    <p className="text-sm flex items-center gap-2">
                        <Mail size={16} /> Email:
                        <a href="mailto:humas.kkp@kkp.go.id" className="text-blue-400 hover:text-blue-300">
                            humas.kkp@kkp.go.id
                        </a>
                    </p>
                    <p className="text-sm">Call Center KKP: 141</p>
                </div>


            </div>
            <div className='text-center text-gray-400'>
                <p>© Copyright 2025, Mahasiswa Magang Universitas Andalas 2025
                </p>
            </div>
        </footer>
    );
};

export default KKPFooter;