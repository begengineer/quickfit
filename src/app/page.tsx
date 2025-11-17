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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-white">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-8 shadow-xl animate-slideDown">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">{t.siteTitle}</h1>
              <p className="mt-2 text-green-100 text-lg">{t.siteSubtitle}</p>
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
        <div className="container mx-auto px-4 py-8 animate-fadeIn">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-10 mb-8 border border-gray-100">
            <h2 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {t.howToUse.title}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* ステップ1 */}
              <div className="text-center animate-slideUp">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg transform transition-transform hover:scale-110">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {t.howToUse.step1.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t.howToUse.step1.description}
                </p>
              </div>

              {/* ステップ2 */}
              <div className="text-center animate-slideUp animate-delay-100">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg transform transition-transform hover:scale-110">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {t.howToUse.step2.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t.howToUse.step2.description}
                </p>
              </div>

              {/* ステップ3 */}
              <div className="text-center animate-slideUp animate-delay-200">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg transform transition-transform hover:scale-110">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {t.howToUse.step3.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
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
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-10 animate-scaleIn">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-8 px-10 rounded-xl transition-all text-2xl shadow-lg btn-hover-lift disabled:transform-none disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.main.searching}
                </span>
              ) : (
                t.main.findVideo
              )}
            </button>

            {error && (
              <p className="mt-6 text-red-600 text-center font-semibold animate-fadeIn">{error}</p>
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
            <div className="text-center animate-fadeIn">
              <button
                onClick={() => {
                  setVideo(null);
                  setError(null);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-green-600 hover:text-green-700 font-bold rounded-lg shadow-md hover:shadow-lg transition-all border-2 border-green-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
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
