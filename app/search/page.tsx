'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ComicCard from '@/components/comic-card';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [comics, setComics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/comics/search?q=${encodeURIComponent(query)}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        setComics(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Search error:', error);
        setLoading(false);
      });
  }, [query, page]);

  return (
    <main className="min-h-screen bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Hasil Pencarian untuk: <span className="text-blue-400">"{query}"</span>
          </h1>
          <p className="text-neutral-400">
            Ditemukan {comics.length} komik
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-neutral-700 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-neutral-400 mt-4">Mencari komik...</p>
          </div>
        ) : comics.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
              {comics.map((comic: any) => (
                <ComicCard key={comic.manga_id} {...comic} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-100 rounded-lg transition-colors"
              >
                Previous
              </button>
              <span className="text-neutral-400">Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={comics.length === 0}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-100 rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-lg">
              Tidak ada komik yang ditemukan untuk "{query}"
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
