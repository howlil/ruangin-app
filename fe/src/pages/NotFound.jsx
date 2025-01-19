import React from 'react';
import { Ghost, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const router = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-6">
      <div className="text-center">
          <div className="mb-8 relative">
          <Ghost
            size={120}
            className="text-blue-500 animate-pulse	 inline-block"
          />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-gray-200 rounded-full blur-sm" />
        </div>

        {/* Error Numbers with Glowing Effect */}
        <h1 className="text-9xl font-bold text-gray-900 tracking-widest mb-8 relative">
          <span className="inline-block transform hover:scale-110 transition-transform hover:text-blue-500">4</span>
          <span className="inline-block transform hover:scale-110 transition-transform hover:text-blue-500">0</span>
          <span className="inline-block transform hover:scale-110 transition-transform hover:text-blue-500">4</span>
          {/* Glowing Circle */}
          <div className="absolute -inset-2 bg-blue-100 rounded-full blur-xl opacity-50"></div>
        </h1>

        {/* Message */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Oops! Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
          Mari kembali ke halaman utama!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router('/')}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors group"
          >
            <Home className="mr-2 group-hover:animate-pulse" size={20} />
            Kembali ke Beranda
          </button>

        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg
            className="w-full h-auto"
            viewBox="0 0 1440 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#E0E7FF"
              fillOpacity="0.5"
              d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}