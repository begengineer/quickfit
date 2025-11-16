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
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* YouTube埋め込みプレーヤー */}
      <div className="aspect-video w-full mb-4">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${video.video_id}`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
        />
      </div>

      {/* タイトルと説明 */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
        <p className="text-gray-600 text-sm line-clamp-3">
          {video.description}
        </p>
      </div>

      {/* 動画情報 */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <span>⏱️ {Math.floor(video.duration_sec / 60)}{t.video.duration} {video.duration_sec % 60}s</span>
        <span>👁️ {video.view_count.toLocaleString()} {t.video.views}</span>
      </div>

      {/* 別の動画ボタン */}
      <button
        onClick={onRefresh}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        {t.main.anotherVideo}
      </button>
    </div>
  );
}
