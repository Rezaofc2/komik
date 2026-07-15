import Link from 'next/link';
import Image from 'next/image';

interface ComicCardProps {
  manga_id: string;
  title: string;
  thumbnailUrl: string;
  type: string;
  latestChapter: string;
}

export default function ComicCard({ manga_id, title, thumbnailUrl, type, latestChapter }: ComicCardProps) {
  return (
    <Link href={`/comic/${manga_id}`}>
      <div className="group cursor-pointer rounded-lg overflow-hidden bg-neutral-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-700">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover group-hover:brightness-75 transition-all duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-700 to-neutral-800">
              <span className="text-neutral-500 text-sm">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-3">
          <h3 className="text-sm font-semibold text-neutral-100 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between mt-2 text-xs text-neutral-400">
            <span className="inline-block px-2 py-1 bg-neutral-700 rounded text-blue-400">
              {type}
            </span>
            {latestChapter && (
              <span className="text-neutral-500">Ch. {latestChapter}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
