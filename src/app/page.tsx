'use client';

import { useState, useEffect } from 'react';
import { Video, VideoLevel } from '@/types';
import VideoPlayer from '@/components/VideoPlayer';
import AdSense from '@/components/AdSense';

export default function Home() {
  const [level, setLevel] = useState<VideoLevel>('beginner');
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watchedIds, setWatchedIds] = useState<string[]>([]);

  // localStorageから視聴履歴を読み込み
  useEffect(() => {
    const stored = localStorage.getItem('watchedVideoIds');
    if (stored) {
      setWatchedIds(JSON.parse(stored));
    }
  }, []);

  // 視聴履歴を保存
  const addToWatched = (videoId: string) => {
    const newWatched = [...watchedIds, videoId].slice(-10); // 最新10件まで
    setWatchedIds(newWatched);
    localStorage.setItem('watchedVideoIds', JSON.stringify(newWatched));
  };

  // 動画を取得
  const fetchVideo = async (selectedLevel: VideoLevel) => {
    setLoading(true);
    setError(null);

    try {
      const excludeIds = watchedIds.join(',');
      const response = await fetch(
        `/api/videos?level=${selectedLevel}&excludeIds=${excludeIds}`
      );

      if (!response.ok) {
        throw new Error('動画の取得に失敗しました');
      }

      const data = await response.json();

      if (data.success && data.video) {
        setVideo(data.video);
        addToWatched(data.video.video_id);
      } else {
        setError(data.error || '動画が見つかりませんでした');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // 動画を探すボタン
  const handleSearch = () => {
    fetchVideo(level);
  };

  // 別の動画をもう1本
  const handleRefresh = () => {
    if (video) {
      fetchVideo(video.level);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">QuickFit</h1>
          <p className="text-center mt-2 text-blue-100">
            10分サーキットトレーニング動画
          </p>
        </div>
      </header>

      {/* 広告エリア（ヘッダー下） */}
      <div className="container mx-auto px-4 py-4">
        <AdSense className="max-w-4xl mx-auto" />
      </div>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        {/* 難易度選択フォーム */}
        {!video && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              難易度を選択してください
            </h2>

            <div className="space-y-4 mb-6">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="radio"
                  name="level"
                  value="beginner"
                  checked={level === 'beginner'}
                  onChange={(e) => setLevel(e.target.value as VideoLevel)}
                  className="w-5 h-5 text-blue-600"
                />
                <div className="ml-4">
                  <span className="text-lg font-semibold">初級</span>
                  <p className="text-sm text-gray-600">
                    運動初心者向け、ゆっくりとしたペース
                  </p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="radio"
                  name="level"
                  value="intermediate"
                  checked={level === 'intermediate'}
                  onChange={(e) => setLevel(e.target.value as VideoLevel)}
                  className="w-5 h-5 text-blue-600"
                />
                <div className="ml-4">
                  <span className="text-lg font-semibold">中級</span>
                  <p className="text-sm text-gray-600">
                    ある程度運動習慣がある方向け
                  </p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="radio"
                  name="level"
                  value="advanced"
                  checked={level === 'advanced'}
                  onChange={(e) => setLevel(e.target.value as VideoLevel)}
                  className="w-5 h-5 text-blue-600"
                />
                <div className="ml-4">
                  <span className="text-lg font-semibold">上級</span>
                  <p className="text-sm text-gray-600">
                    ハードなトレーニングを求める方向け
                  </p>
                </div>
              </label>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
            >
              {loading ? '動画を探しています...' : '動画を探す'}
            </button>

            {error && (
              <p className="mt-4 text-red-600 text-center">{error}</p>
            )}
          </div>
        )}

        {/* 動画表示エリア */}
        {video && !loading && (
          <div className="space-y-6">
            <VideoPlayer video={video} onRefresh={handleRefresh} />

            {/* 広告エリア（動画下） */}
            <div className="max-w-4xl mx-auto">
              <AdSense />
            </div>

            {/* レベル変更ボタン */}
            <div className="text-center">
              <button
                onClick={() => {
                  setVideo(null);
                  setError(null);
                }}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                難易度を変更する
              </button>
            </div>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-gray-100 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <div className="space-x-6 mb-4">
            <a href="/privacy-policy" className="hover:text-blue-600">
              プライバシーポリシー
            </a>
            <a href="/terms" className="hover:text-blue-600">
              利用規約
            </a>
          </div>
          <p className="text-sm">© 2025 QuickFit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
