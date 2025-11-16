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
  const fetchVideo = async () => {
    setLoading(true);
    setError(null);

    try {
      const excludeIds = watchedIds.join(',');
      const response = await fetch(
        `/api/videos?excludeIds=${excludeIds}`
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
    fetchVideo();
  };

  // 別の動画をもう1本
  const handleRefresh = () => {
    fetchVideo();
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
        {/* 動画検索ボタン（難易度選択なし、自重系のみ） */}
        {!video && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-6 px-8 rounded-lg transition-colors text-xl"
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

            {/* トップに戻るボタン */}
            <div className="text-center">
              <button
                onClick={() => {
                  setVideo(null);
                  setError(null);
                }}
                className="text-green-600 hover:text-green-800 underline font-semibold"
              >
                {t.main.backToTop}
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
