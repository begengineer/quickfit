'use client';

import { useState, useEffect } from 'react';
import { Video, VideoLevel } from '@/types';
import VideoPlayer from '@/components/VideoPlayer';
import AdSense from '@/components/AdSense';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function Home() {
  const { t } = useLanguage();
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
        throw new Error(t.error.fetchFailed);
      }

      const data = await response.json();

      if (data.success && data.video) {
        setVideo(data.video);
        addToWatched(data.video.video_id);
      } else {
        setError(data.error || t.error.noVideos);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error.unexpectedError);
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">{t.siteTitle}</h1>
              <p className="mt-2 text-blue-100">{t.siteSubtitle}</p>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* 広告エリア（ヘッダー下） */}
      <div className="container mx-auto px-4 py-4">
        <AdSense className="max-w-4xl mx-auto" />
      </div>

      {/* 使い方セクション */}
      {!video && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
              {t.howToUse.title}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* ステップ1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t.howToUse.step1.title}
                </h3>
                <p className="text-gray-600">
                  {t.howToUse.step1.description}
                </p>
              </div>

              {/* ステップ2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t.howToUse.step2.title}
                </h3>
                <p className="text-gray-600">
                  {t.howToUse.step2.description}
                </p>
              </div>

              {/* ステップ3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {t.howToUse.step3.title}
                </h3>
                <p className="text-gray-600">
                  {t.howToUse.step3.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        {/* 難易度選択フォーム */}
        {!video && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {t.main.selectLevel}
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
                  <span className="text-lg font-semibold">{t.main.beginner.title}</span>
                  <p className="text-sm text-gray-600">
                    {t.main.beginner.description}
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
                  <span className="text-lg font-semibold">{t.main.intermediate.title}</span>
                  <p className="text-sm text-gray-600">
                    {t.main.intermediate.description}
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
                  <span className="text-lg font-semibold">{t.main.advanced.title}</span>
                  <p className="text-sm text-gray-600">
                    {t.main.advanced.description}
                  </p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-colors border-green-400">
                <input
                  type="radio"
                  name="level"
                  value="bodyweight"
                  checked={level === 'bodyweight'}
                  onChange={(e) => setLevel(e.target.value as VideoLevel)}
                  className="w-5 h-5 text-green-600"
                />
                <div className="ml-4">
                  <span className="text-lg font-semibold text-green-700">{t.main.bodyweight.title}</span>
                  <p className="text-sm text-gray-600">
                    {t.main.bodyweight.description}
                  </p>
                </div>
              </label>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
            >
              {loading ? t.main.searching : t.main.findVideo}
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
                {t.main.changeLevel}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-gray-100 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <div className="space-x-6 mb-4">
            <Link href="/privacy-policy" className="hover:text-blue-600">
              {t.footer.privacyPolicy}
            </Link>
            <Link href="/terms" className="hover:text-blue-600">
              {t.footer.terms}
            </Link>
          </div>
          <p className="text-sm">{t.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
