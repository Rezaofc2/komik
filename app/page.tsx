'use client';

import { useEffect, useState } from 'react';
import ComicCard from '@/components/comic-card';
import DonationModal from '@/components/donation-modal';

export default function Home() {
  const [ongoingComics, setOngoingComics] = useState<any[]>([]);
  const [popularComics, setPopularComics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [comicType, setComicType] = useState<'manhwa' | 'manga' | 'manhua'>('manhwa');

  const types = [
    { id: 'manhwa', label: 'Manhwa' },
    { id: 'manga', label: 'Manga' },
    { id: 'manhua', label: 'Manhua' },
  ];

  useEffect(() => {
    const fetchComics = async () => {
      try {
        setLoading(true);
        const [ongoingRes, popularRes] = await Promise.all([
          fetch(`/api/comics/latest?page=1&type=${comicType}`),
          fetch(`/api/comics/popular?page=1&type=${comicType}`)
        ]);

        const ongoing = ongoingRes.ok ? await ongoingRes.json() : [];
        const popular = popularRes.ok ? await popularRes.json() : [];

        setOngoingComics(ongoing);
        setPopularComics(popular);
      } catch (error) {
        console.error('Failed to fetch comics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, [comicType]);

  return (
    <main className="min-h-screen bg-neutral-950">
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:py-20 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Baca Komik Online
                </span>
              </h1>
              <p className="text-neutral-400 text-base sm:text-lg md:text-xl">
                Manhwa, Manga, dan Manhua terbaik dalam satu tempat
              </p>
            </div>
            {/* Type Filter */}
            <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
              {types.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setComicType(type.id as 'manhwa' | 'manga' | 'manhua')}
                  className={`px-4 sm:px-5 py-2 rounded-lg font-semibold transition-all transform ${
                    comicType === type.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:scale-105'
                      : 'bg-neutral-800 text-neutral-100 hover:bg-neutral-700 border border-neutral-700'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3 sm:gap-4 justify-center flex-wrap pt-4">
              <a href="/ongoing" className="px-5 sm:px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg font-semibold transition-colors border border-neutral-700">
                Komik Ongoing
              </a>
              <a href="/genre" className="px-5 sm:px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg font-semibold transition-colors border border-neutral-700">
                Jelajahi Genre
              </a>
              <DonationModal />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-neutral-700 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-neutral-400 mt-4">Memuat komik terbaik...</p>
          </div>
        ) : (
          <>
            {/* Ongoing Section */}
            {ongoingComics.length > 0 && (
              <section className="mb-16 sm:mb-20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    <span className="text-neutral-100">Komik </span>
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      Terbaru
                    </span>
                  </h2>
                  <a href="/ongoing" className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-semibold whitespace-nowrap">
                    Lihat Semua →
                  </a>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {ongoingComics.slice(0, 12).map((comic: any) => (
                    <ComicCard key={comic.manga_id} {...comic} />
                  ))}
                </div>
              </section>
            )}

            {/* Popular Section */}
            {popularComics.length > 0 && (
              <section className="mb-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    <span className="text-neutral-100">Komik </span>
                    <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                      Populer
                    </span>
                  </h2>
                  <a href="/genre" className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-semibold whitespace-nowrap">
                    Lihat Semua →
                  </a>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {popularComics.slice(0, 12).map((comic: any) => (
                    <ComicCard key={comic.manga_id} {...comic} />
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {ongoingComics.length === 0 && popularComics.length === 0 && (
              <div className="text-center py-20">
                <p className="text-neutral-500 text-lg">
                  Tidak ada komik tersedia. Silakan coba lagi nanti.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
