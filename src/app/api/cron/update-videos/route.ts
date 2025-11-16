import { NextRequest, NextResponse } from 'next/server';
import {
  searchVideos,
  getVideoDetails,
  filterVideos,
  calculateScore,
} from '@/lib/youtube/client';
import {
  saveVideo,
  pruneVideosByLevel,
  getVideoCountByLevel,
} from '@/lib/firebase/videos';
import { VideoLevel, BatchUpdateResponse } from '@/types';

// Vercel Cron Jobsの認証
function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.warn('CRON_SECRET is not configured');
    return false;
  }

  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  // 認証チェック
  if (!verifyAuth(request)) {
    return NextResponse.json<BatchUpdateResponse>(
      { success: false, message: 'Unauthorized', error: 'Invalid authorization' },
      { status: 401 }
    );
  }

  try {
    const levels: VideoLevel[] = ['beginner', 'intermediate', 'advanced'];
    const stats = {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
    };

    // 各レベルごとに処理
    for (const level of levels) {
      console.log(`Processing level: ${level}`);

      try {
        // 1. YouTube検索
        const searchResults = await searchVideos(level, 50);
        console.log(`Found ${searchResults.length} videos for ${level}`);

        if (searchResults.length === 0) {
          continue;
        }

        // 2. 動画詳細を取得
        const videoIds = searchResults.map((r) => r.videoId);
        const videoDetails = await getVideoDetails(videoIds);
        console.log(`Got details for ${videoDetails.length} videos`);

        // 3. フィルタリング（10分以内 + 難易度判定）
        const filteredVideos = filterVideos(videoDetails, level);
        console.log(`Filtered to ${filteredVideos.length} videos`);

        // 4. スコア計算して保存
        for (const video of filteredVideos) {
          const score = calculateScore(video);

          await saveVideo({
            video_id: video.videoId,
            level,
            title: video.title,
            description: video.description,
            thumbnail_url: video.thumbnailUrl,
            duration_sec: video.durationSec,
            view_count: video.viewCount,
            published_at: video.publishedAt,
            score,
            updated_at: new Date().toISOString(),
          });
        }

        // 5. 最大50件まで保持（スコア順）
        await pruneVideosByLevel(level, 50);

        // 6. 統計
        const count = await getVideoCountByLevel(level);
        stats[level] = count;

        console.log(`Completed ${level}: ${count} videos stored`);
      } catch (error) {
        console.error(`Error processing level ${level}:`, error);
        // エラーでも他のレベルは処理を続行
      }
    }

    return NextResponse.json<BatchUpdateResponse>(
      {
        success: true,
        message: 'Batch update completed successfully',
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in batch update:', error);
    return NextResponse.json<BatchUpdateResponse>(
      {
        success: false,
        message: 'Batch update failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
