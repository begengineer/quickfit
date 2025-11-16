import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  orderBy,
  limit as firestoreLimit,
} from 'firebase/firestore';
import { db } from './config';
import { Video, VideoLevel } from '@/types';

const VIDEOS_COLLECTION = 'videos';

/**
 * 指定レベルの動画を全て取得
 */
export async function getVideosByLevel(level: VideoLevel): Promise<Video[]> {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    const q = query(
      videosRef,
      where('level', '==', level),
      orderBy('score', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const videos: Video[] = [];

    querySnapshot.forEach((doc) => {
      videos.push({ id: doc.id, ...doc.data() } as Video);
    });

    return videos;
  } catch (error) {
    console.error('Error getting videos by level:', error);
    throw error;
  }
}

/**
 * ランダムに1本の動画を取得（除外リスト対応）
 */
export async function getRandomVideo(
  level: VideoLevel,
  excludeIds: string[] = []
): Promise<Video | null> {
  try {
    const videos = await getVideosByLevel(level);

    // 除外リストを適用
    const filteredVideos = videos.filter(
      (video) => !excludeIds.includes(video.video_id)
    );

    if (filteredVideos.length === 0) {
      return null;
    }

    // ランダムに選択
    const randomIndex = Math.floor(Math.random() * filteredVideos.length);
    return filteredVideos[randomIndex];
  } catch (error) {
    console.error('Error getting random video:', error);
    throw error;
  }
}

/**
 * 動画を保存または更新
 */
export async function saveVideo(video: Omit<Video, 'id'>): Promise<void> {
  try {
    const videoRef = doc(db, VIDEOS_COLLECTION, video.video_id);
    await setDoc(videoRef, video);
  } catch (error) {
    console.error('Error saving video:', error);
    throw error;
  }
}

/**
 * 指定レベルの動画を最大件数まで保持（スコア順）
 * スコアが低いものから削除
 */
export async function pruneVideosByLevel(
  level: VideoLevel,
  maxCount: number = 50
): Promise<void> {
  try {
    const videos = await getVideosByLevel(level);

    if (videos.length <= maxCount) {
      return;
    }

    // スコアが低い順にソート
    videos.sort((a, b) => a.score - b.score);

    // 削除対象
    const toDelete = videos.slice(0, videos.length - maxCount);

    // 削除実行
    for (const video of toDelete) {
      await deleteDoc(doc(db, VIDEOS_COLLECTION, video.video_id));
    }

    console.log(
      `Pruned ${toDelete.length} videos from level ${level}`
    );
  } catch (error) {
    console.error('Error pruning videos:', error);
    throw error;
  }
}

/**
 * 指定レベルの動画数を取得
 */
export async function getVideoCountByLevel(level: VideoLevel): Promise<number> {
  try {
    const videos = await getVideosByLevel(level);
    return videos.length;
  } catch (error) {
    console.error('Error getting video count:', error);
    throw error;
  }
}
