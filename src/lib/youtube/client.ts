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
    case 'bodyweight':
      return `サーキットトレーニング 自重 OR 自重トレーニング OR 器具なし OR 自宅トレーニング`;
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
      videoDuration: 'medium', // 4～20分（後で7～15分にフィルタ）
      relevanceLanguage: 'ja',
      regionCode: 'JP', // 日本地域の動画を優先
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
 * 日本語が含まれているかチェック（ひらがな、カタカナ、漢字）
 */
function hasJapanese(text: string): boolean {
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
  return japaneseRegex.test(text);
}

/**
 * 動画をフィルタリング（7～15分、日本語動画のみ、難易度判定）
 */
export function filterVideos(
  videos: YouTubeVideoDetails[],
  level: VideoLevel,
  minDuration: number = 420, // 7分
  maxDuration: number = 900 // 15分
): YouTubeVideoDetails[] {
  return videos.filter((video) => {
    // 時間制限（7～15分）
    if (video.durationSec < minDuration || video.durationSec > maxDuration) {
      return false;
    }

    // 日本語動画のみ（タイトルに日本語が含まれているかチェック）
    // ただし、自重系の場合は日本語チェックをスキップ
    if (level !== 'bodyweight' && !hasJapanese(video.title)) {
      return false;
    }

    // タイトル・説明文で難易度を再判定（緩和版）
    const text = `${video.title} ${video.description}`.toLowerCase();

    switch (level) {
      case 'beginner':
        // 初級は明示的に初心者向けキーワードがある動画のみ
        return (
          text.includes('beginner') ||
          text.includes('初級') ||
          text.includes('初心者') ||
          text.includes('for beginners') ||
          text.includes('easy')
        );
      case 'intermediate':
        // 中級は初心者向けキーワードがなければOK
        const hasBeginnerKeywords =
          text.includes('beginner') ||
          text.includes('初級') ||
          text.includes('初心者') ||
          text.includes('for beginners');
        return !hasBeginnerKeywords;
      case 'advanced':
        // 上級も初心者向けキーワードがなければOK（より厳しい動画を含む）
        const hasBeginnerKeywordsAdv =
          text.includes('beginner') ||
          text.includes('初級') ||
          text.includes('初心者') ||
          text.includes('for beginners');
        return !hasBeginnerKeywordsAdv;
      case 'bodyweight':
        // 自重系は検索クエリで既にフィルタ済みなので、時間と日本語チェックのみ
        // 検索クエリに「自重」「bodyweight」などが含まれているため、
        // 返ってくる動画は基本的に自重系に関連している
        return true;
      default:
        return true;
    }
  });
}

/**
 * 独自スコアを計算（再生数重視 + 新しさ）
 */
export function calculateScore(video: YouTubeVideoDetails): number {
  const viewWeight = 0.1; // 再生数の重み（大幅に増加）
  const ageWeight = 1000; // 新しさの重み（日数）

  // 公開日からの日数
  const publishedDate = new Date(video.publishedAt);
  const now = new Date();
  const daysSincePublished = Math.floor(
    (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // スコア計算（再生数を重視、新しさもボーナス）
  const viewScore = video.viewCount * viewWeight;
  const ageScore = Math.max(0, ageWeight - daysSincePublished);

  return viewScore + ageScore;
}
