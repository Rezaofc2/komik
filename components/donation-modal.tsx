'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function DonationModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 sm:px-5 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
      >
        Donasi ❤️
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-neutral-900 rounded-lg p-6 sm:p-8 max-w-sm w-full border border-neutral-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Dukung Kami</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-neutral-300 mb-6">
              Terima kasih telah mendukung Komiku! Scan QR code di bawah untuk melakukan donasi.
            </p>

            <div className="bg-white p-4 rounded-lg mb-6 flex justify-center">
              <Image
                src="/qris.png"
                alt="QRIS Donation"
                width={280}
                height={280}
                className="w-full max-w-xs"
              />
            </div>

            <p className="text-sm text-neutral-400 text-center mb-4">
              QRIS: Satu QR untuk Semua Pembayaran
            </p>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
