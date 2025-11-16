// 動画レベル（自重系のみ）
export type VideoLevel = 'bodyweight';

// 動画データモデル
export interface Video {
  id: string;                 // 内部ID（Firestoreドキュメント）
  video_id: string;           // YouTube videoId
  level: VideoLevel;          // 難易度
  title: string;              // 動画タイトル
  description: string;        // 説明文
  thumbnail_url: string;      // サムネイルURL
  duration_sec: number;       // 秒数（<= 600）
  view_count: number;         // 再生数
  published_at: string;       // 公開日（ISO 8601形式）
  score: number;              // 独自スコア
  updated_at: string;         // 最終更新日（ISO 8601形式）
}

// 動画検索結果（YouTube API）
export interface YouTubeSearchResult {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
}

// 動画詳細情報（YouTube API）
export interface YouTubeVideoDetails {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  durationSec: number;
  viewCount: number;
  publishedAt: string;
}

// API レスポンス: 動画取得
export interface GetVideoResponse {
  success: boolean;
  video?: Video;
  error?: string;
}

// API レスポンス: バッチ更新
export interface BatchUpdateResponse {
  success: boolean;
  message: string;
  stats?: {
    bodyweight: number;
  };
  error?: string;
}
