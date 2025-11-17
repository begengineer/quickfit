'use client';

import { Video } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface VideoPlayerProps {
  video: Video;
  onRefresh: () => void;
}

export default function VideoPlayer({ video, onRefresh }: VideoPlayerProps) {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 animate-scaleIn border border-gray-100">
      {/* YouTube埋め込みプレーヤー */}
      <div className="aspect-video w-full mb-6 overflow-hidden rounded-xl shadow-lg">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${video.video_id}`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-xl"
        />
      </div>

      {/* タイトルと説明 */}
      <div className="mb-6 animate-fadeIn">
        <h2 className="text-3xl font-bold mb-3 text-gray-800 leading-tight">{video.title}</h2>
        <p className="text-gray-600 text-base line-clamp-3 leading-relaxed">
          {video.description}
        </p>
      </div>

      {/* 動画情報 */}
      <div className="flex items-center gap-6 text-base text-gray-700 mb-6 bg-gray-100 p-4 rounded-lg animate-fadeIn border border-gray-200">
        <span className="flex items-center gap-2">
          <span className="text-2xl">⏱️</span>
          <span className="font-semibold">{Math.floor(video.duration_sec / 60)}{t.video.duration} {video.duration_sec % 60}s</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-2xl">👁️</span>
          <span className="font-semibold">{video.view_count.toLocaleString()} {t.video.views}</span>
        </span>
      </div>

      {/* 別の動画ボタン */}
      <button
        onClick={onRefresh}
        className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg btn-hover-lift text-lg"
      >
        {t.main.anotherVideo}
      </button>
    </div>
  );
}
