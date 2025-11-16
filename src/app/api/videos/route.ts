import { NextRequest, NextResponse } from 'next/server';
import { getRandomVideo } from '@/lib/firebase/videos';
import { VideoLevel, GetVideoResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const level = searchParams.get('level') as VideoLevel;
    const excludeIdsParam = searchParams.get('excludeIds');

    // バリデーション
    if (!level || !['beginner', 'intermediate', 'advanced'].includes(level)) {
      return NextResponse.json<GetVideoResponse>(
        { success: false, error: 'Invalid level parameter' },
        { status: 400 }
      );
    }

    // 除外リストのパース
    const excludeIds = excludeIdsParam
      ? excludeIdsParam.split(',').filter(Boolean)
      : [];

    // ランダムに動画を取得
    const video = await getRandomVideo(level, excludeIds);

    if (!video) {
      return NextResponse.json<GetVideoResponse>(
        { success: false, error: 'No videos found for this level' },
        { status: 404 }
      );
    }

    return NextResponse.json<GetVideoResponse>(
      { success: true, video },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/videos:', error);
    return NextResponse.json<GetVideoResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
