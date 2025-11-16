import { google, youtube_v3 } from 'googleapis';
import { VideoLevel, YouTubeSearchResult, YouTubeVideoDetails } from '@/types';

const youtube = google.youtube('v3');
const API_KEY = process.env.YOUTUBE_API_KEY;

/**
 * 難易度に応じた検索クエリを生成
 */
export function generateSearchQuery(level: VideoLevel): string {
  const baseQuery = 'circuit training workout';

  switch (level) {
    case 'beginner':
      return `${baseQuery} (beginner OR "for beginners" OR 初級 OR 初心者)`;
    case 'intermediate':
      return `${baseQuery} (intermediate OR 中級)`;
    case 'advanced':
      return `${baseQuery} (advanced OR 上級 OR ハード OR 高強度)`;
    default:
      return baseQuery;
  }
}

/**
 * YouTube動画を検索
 */
export async function searchVideos(
  level: VideoLevel,
  maxResults: number = 50
): Promise<YouTubeSearchResult[]> {
  if (!API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  try {
    const query = generateSearchQuery(level);

    const response = await youtube.search.list({
      key: API_KEY,
      part: ['snippet'],
      q: query,
      type: ['video'],
      maxResults,
      videoDuration: 'short', // 4分未満（後でフィルタ）
      relevanceLanguage: 'ja',
      order: 'relevance',
    });

    const results: YouTubeSearchResult[] = [];

    if (response.data.items) {
      for (const item of response.data.items) {
        if (item.id?.videoId && item.snippet) {
          results.push({
            videoId: item.id.videoId,
            title: item.snippet.title || '',
            description: item.snippet.description || '',
            thumbnailUrl: item.snippet.thumbnails?.high?.url || '',
            publishedAt: item.snippet.publishedAt || '',
          });
        }
      }
    }

    return results;
  } catch (error) {
    console.error('Error searching videos:', error);
    throw error;
  }
}

/**
 * 動画の詳細情報を取得（複数）
 */
export async function getVideoDetails(
  videoIds: string[]
): Promise<YouTubeVideoDetails[]> {
  if (!API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  if (videoIds.length === 0) {
    return [];
  }

  try {
    const response = await youtube.videos.list({
      key: API_KEY,
      part: ['snippet', 'contentDetails', 'statistics'],
      id: videoIds,
    });

    const details: YouTubeVideoDetails[] = [];

    if (response.data.items) {
      for (const item of response.data.items) {
        if (item.id && item.snippet && item.contentDetails && item.statistics) {
          const durationSec = parseDuration(item.contentDetails.duration || '');

          details.push({
            videoId: item.id,
            title: item.snippet.title || '',
            description: item.snippet.description || '',
            thumbnailUrl: item.snippet.thumbnails?.high?.url || '',
            durationSec,
            viewCount: parseInt(item.statistics.viewCount || '0', 10),
            publishedAt: item.snippet.publishedAt || '',
          });
        }
      }
    }

    return details;
  } catch (error) {
    console.error('Error getting video details:', error);
    throw error;
  }
}

/**
 * ISO 8601 duration形式をパース（例: PT10M30S -> 630秒）
 */
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) {
    return 0;
  }

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * 動画をフィルタリング（10分以内、タイトル・説明で難易度判定）
 */
export function filterVideos(
  videos: YouTubeVideoDetails[],
  level: VideoLevel,
  maxDuration: number = 600 // 10分
): YouTubeVideoDetails[] {
  return videos.filter((video) => {
    // 時間制限
    if (video.durationSec > maxDuration) {
      return false;
    }

    // タイトル・説明文で難易度を再判定（簡易版）
    const text = `${video.title} ${video.description}`.toLowerCase();

    switch (level) {
      case 'beginner':
        return (
          text.includes('beginner') ||
          text.includes('初級') ||
          text.includes('初心者') ||
          text.includes('for beginners')
        );
      case 'intermediate':
        return text.includes('intermediate') || text.includes('中級');
      case 'advanced':
        return (
          text.includes('advanced') ||
          text.includes('上級') ||
          text.includes('ハード') ||
          text.includes('高強度')
        );
      default:
        return true;
    }
  });
}

/**
 * 独自スコアを計算（再生数 + 新しさ）
 */
export function calculateScore(video: YouTubeVideoDetails): number {
  const viewWeight = 0.001; // 再生数の重み
  const ageWeight = 10000; // 新しさの重み（日数）

  // 公開日からの日数
  const publishedDate = new Date(video.publishedAt);
  const now = new Date();
  const daysSincePublished = Math.floor(
    (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // スコア計算（再生数が多く、新しいほど高スコア）
  const viewScore = video.viewCount * viewWeight;
  const ageScore = Math.max(0, ageWeight - daysSincePublished * 10);

  return viewScore + ageScore;
}
