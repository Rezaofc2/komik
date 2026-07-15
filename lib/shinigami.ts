/**
✧ Name   :  shinigami scraper
✧ Creator   : Naotica
✧ Category  : API Scraper
**/

const SHINIGAMI_API = 'https://api.shngm.io';
const SHINIGAMI_ORIGIN = 'https://g.shinigami.asia';

async function apiGet(path: string) {
  try {
    const res = await fetch(`${SHINIGAMI_API}${path}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Accept': 'application/json',
        'Origin': SHINIGAMI_ORIGIN,
        'Referer': `${SHINIGAMI_ORIGIN}/`,
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const json = await res.json() as any;
    if (json.retcode !== 0) throw new Error(json.message || 'API error');
    
    return json.data || null;
  } catch (error) {
    console.error(`[Shinigami] Error fetching ${path}:`, error);
    return null;
  }
}

export async function getLatestComicsReleases(page = 1) {
  const data = await apiGet(`/v1/manga/list?type=project&page=${page}&page_size=24&is_update=true&sort=latest&sort_order=desc`);
  if (!Array.isArray(data)) return [];

  return data.map((item: any) => ({
    title: item.title || '',
    manga_id: item.manga_id || '',
    type: item.taxonomy?.Format?.[0]?.name || 'Manhwa',
    latestChapter: item.latest_chapter_number?.toString() || '',
    thumbnailUrl: item.cover_portrait_url || item.cover_image_url || '',
    shortDescription: item.description ? item.description.substring(0, 80) : '',
  }));
}

export async function getPopularComicsReleases(page = 1) {
  const data = await apiGet(`/v1/manga/top?filter=daily&page=${page}&page_size=24`);
  if (!Array.isArray(data)) return [];

  return data.map((item: any) => ({
    title: item.title || '',
    manga_id: item.manga_id || '',
    type: item.taxonomy?.Format?.[0]?.name || 'Manhwa',
    latestChapter: item.latest_chapter_number?.toString() || '',
    thumbnailUrl: item.cover_portrait_url || item.cover_image_url || '',
    shortDescription: item.description ? item.description.substring(0, 80) : '',
  }));
}

export async function getComicsSearch(query: string, page = 1) {
  const data = await apiGet(`/v1/manga/list?q=${encodeURIComponent(query)}&page=${page}&page_size=24&sort=latest&sort_order=desc`);
  if (!Array.isArray(data)) return [];

  return data.map((item: any) => ({
    title: item.title || '',
    manga_id: item.manga_id || '',
    type: item.taxonomy?.Format?.[0]?.name || 'Manhwa',
    latestChapter: item.latest_chapter_number?.toString() || '',
    thumbnailUrl: item.cover_portrait_url || item.cover_image_url || '',
  }));
}

export async function getComicsByGenre(genre: string, page = 1) {
  const genreSlug = genre.toLowerCase().replace(/\s+/g, '-');
  const data = await apiGet(`/v1/manga/list?page=${page}&page_size=24&genre=${encodeURIComponent(genreSlug)}&sort=latest&sort_order=desc`);
  if (!Array.isArray(data)) return [];

  return data.map((item: any) => ({
    title: item.title || '',
    manga_id: item.manga_id || '',
    type: item.taxonomy?.Format?.[0]?.name || 'Manhwa',
    latestChapter: item.latest_chapter_number?.toString() || '',
    thumbnailUrl: item.cover_portrait_url || item.cover_image_url || '',
    shortDescription: item.description ? item.description.substring(0, 80) : '',
  }));
}

export async function getComicsDetail(mangaId: string) {
  const [detailData, chaptersData] = await Promise.all([
    apiGet(`/v1/manga/detail/${mangaId}`),
    fetchAllChapters(mangaId),
  ]);

  if (!detailData) throw new Error('Failed to fetch detail');

  return {
    title: detailData.title || '',
    indonesianTitle: detailData.alternative_title || '',
    type: detailData.taxonomy?.Format?.[0]?.name || 'Manhwa',
    author: detailData.taxonomy?.Author?.[0]?.name || 'Unknown',
    status: detailData.status === 1 ? 'Ongoing' : detailData.status === 2 ? 'End' : 'Unknown',
    thumbnailUrl: detailData.cover_portrait_url || detailData.cover_image_url || '',
    genres: detailData.taxonomy?.Genre?.map((g: any) => g.name) || [],
    synopsis: detailData.description || '',
    chapters: chaptersData,
  };
}

async function fetchAllChapters(mangaId: string) {
  const allChapters: any[] = [];
  let page = 1;

  while (true) {
    const data = await apiGet(`/v1/chapter/${mangaId}/list?page=${page}&page_size=50&sort_by=chapter_number&sort_order=asc`);
    if (!Array.isArray(data) || data.length === 0) break;
    
    allChapters.push(...data);
    if (data.length < 50) break;
    
    page++;
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  return allChapters.reverse().map((ch: any) => ({
    chapter: `Chapter ${ch.chapter_number || ''}${ch.chapter_title ? ` - ${ch.chapter_title}` : ''}`,
    chapterId: ch.chapter_id || '',
    releaseDate: ch.release_date || '',
    views: ch.view_count?.toString() || '',
  }));
}

export async function getComicsReading(chapterId: string) {
  const data = await apiGet(`/v1/chapter/detail/${chapterId}`);
  if (!data) throw new Error('Failed to fetch chapter images');

  const baseUrl = data.base_url || '';
  const chapterPath = data.chapter?.path || '';
  const imageFiles = data.chapter?.data || [];

  return {
    title: `Chapter ${data.chapter_number || ''}${data.chapter_title ? ` - ${data.chapter_title}` : ''}`,
    comicImages: imageFiles.map((file: string) => `${baseUrl}${chapterPath}${file}`)
  };
}
