import { google, youtube_v3 } from 'googleapis';
import { VideoLevel, YouTubeSearchResult, YouTubeVideoDetails } from '@/types';

const youtube = google.youtube('v3');
const API_KEY = process.env.YOUTUBE_API_KEY;

/**
 * 自重系トレーニングの検索クエリを生成
 */
export function generateSearchQuery(level: VideoLevel): string {
  // 自重系のみ
  return `サーキットトレーニング 自重 OR 自重トレーニング OR 器具なし OR 自宅トレーニング`;
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
 * 動画をフィルタリング（自重系トレーニング専用）
 * - 時間制限: 5～20分
 * - 日本語動画のみ
 */
export function filterVideos(
  videos: YouTubeVideoDetails[],
  level: VideoLevel,
  minDuration: number = 300, // 5分
  maxDuration: number = 1200 // 20分
): YouTubeVideoDetails[] {
  return videos.filter((video) => {
    // 時間制限（5～20分）
    if (video.durationSec < minDuration || video.durationSec > maxDuration) {
      return false;
    }

    // 日本語動画のみ（タイトルに日本語が含まれているかチェック）
    if (!hasJapanese(video.title)) {
      return false;
    }

    // 検索クエリで既に自重系でフィルタ済みなので、それ以上の判定は不要
    return true;
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
