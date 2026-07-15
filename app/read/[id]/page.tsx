'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import DonationModal from '@/components/donation-modal';
import CommentsSection from '@/components/comments-section';

interface ChapterData {
  title: string;
  comicImages: string[];
}

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.id as string;
  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (!chapterId) return;

    setLoading(true);
    fetch(`/api/comics/read?id=${chapterId}`)
      .then(res => res.json())
      .then(data => {
        setChapter(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Read fetch error:', error);
        setLoading(false);
      });
  }, [chapterId]);

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => ({ ...prev, [index]: true }));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Memuat chapter...</p>
        </div>
      </main>
    );
  }

  if (!chapter || chapter.comicImages.length === 0) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-neutral-400 text-lg mb-4">Chapter tidak ditemukan atau tidak memiliki gambar</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Kembali
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-neutral-950">
      {/* Reader Header */}
      <div className="sticky top-16 z-40 bg-neutral-900 border-b border-neutral-800 py-3">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-neutral-100 truncate">{chapter.title}</h1>
            <button
              onClick={() => router.back()}
              className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded text-sm transition-colors flex-shrink-0"
            >
              ← Back
            </button>
          </div>
          <div className="flex items-center gap-4 text-xs sm:text-sm text-neutral-400">
            <span>Total {chapter.comicImages.length} halaman</span>
            <div className="flex-1 bg-neutral-800 rounded-full h-1">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all"
                style={{ width: `${(Object.keys(imagesLoaded).length / chapter.comicImages.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Reader Area */}
      <div className="bg-black">
        <div className="max-w-6xl mx-auto">
          {/* Images Stack */}
          <div className="space-y-2 sm:space-y-4 py-4 sm:py-6 px-2 sm:px-4">
            {chapter.comicImages.map((imageUrl, index) => (
              <div key={index} className="relative bg-neutral-900 rounded-lg overflow-hidden">
                <div className="relative w-full aspect-auto">
                  <Image
                    src={imageUrl}
                    alt={`Page ${index + 1}`}
                    width={1200}
                    height={1600}
                    onLoad={() => handleImageLoad(index)}
                    priority={index < 3}
                    className="w-full h-auto"
                    unoptimized
                  />
                  {!imagesLoaded[index] && (
                    <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                      <div className="w-8 h-8 border-3 border-neutral-700 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* End of Chapter */}
          <div className="py-12 px-4 text-center border-t border-neutral-800">
            <p className="text-neutral-400 mb-6">Akhir dari chapter</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors font-medium"
              >
                Kembali
              </button>
              <button
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                title="Chapter sebelumnya"
              >
                ← Chapter Sebelumnya
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="max-w-4xl mx-auto px-4 py-12">
            <CommentsSection chapterId={chapterId} />
          </div>

          {/* Donation Section */}
          <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-800/50 rounded-lg p-8 max-w-4xl mx-auto my-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Dukung Komiku</h3>
            <p className="text-neutral-300 mb-6">Terima kasih telah membaca. Dukung kami agar terus update dengan konten terbaru!</p>
            <DonationModal />
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="bg-neutral-900 border-t border-neutral-800 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-neutral-500">
          <p>Scroll untuk membaca • Gunakan tombol ← → untuk navigasi</p>
        </div>
      </div>
    </main>
  );
}
