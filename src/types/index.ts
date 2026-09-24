export type PlatformType = 'youtube' | 'instagram' | 'unknown';

export interface MediaFormat {
  id: string;
  quality: string;
  resolution: string;
  height: number;
  format: 'mp4' | 'webm' | 'mp3';
  sizeFormatted: string;
  sizeBytes: number;
  fps?: number;
  bitrate?: string;
  url?: string;
  isAudioOnly?: boolean;
  hasAudio?: boolean;
  recommended?: boolean;
}

export interface InstagramCarouselItem {
  id: string;
  type: 'video' | 'image';
  url: string;
  previewUrl: string;
  resolution?: string;
  sizeFormatted?: string;
}

export interface SubtitleTrack {
  lang: string;
  name: string;
  isAuto?: boolean;
}

export interface PlaylistItem {
  id: string;
  index: number;
  title: string;
  url: string;
  duration: number;
  durationFormatted: string;
  author: string;
  thumbnail: string;
}

export interface VideoMetadata {
  id: string;
  originalUrl: string;
  platform: 'youtube' | 'instagram';
  title: string;
  author: string;
  authorAvatar?: string;
  thumbnail: string;
  duration: number; // in seconds
  durationFormatted: string;
  uploadDate: string;
  viewsFormatted?: string;
  likesFormatted?: string;
  formats: MediaFormat[];
  audioFormats: MediaFormat[];
  subtitles?: SubtitleTrack[];
  carouselItems?: InstagramCarouselItem[];
  isPlaylist?: boolean;
  playlistCount?: number;
  playlistItems?: PlaylistItem[];
}

export interface DownloadHistoryItem {
  id: string;
  originalUrl: string;
  title: string;
  platform: 'youtube' | 'instagram';
  format: string;
  quality: string;
  timestamp: number;
  thumbnail: string;
  fileSize: string;
  blobUrl?: string;
  filename: string;
}

export interface DownloadProgressState {
  isDownloading: boolean;
  progress: number;
  status: 'preparing' | 'downloading' | 'converting' | 'completed' | 'cancelled' | 'error';
  speed: string;
  downloadedBytes: number;
  totalBytes: number;
  etaSeconds: number;
  errorMessage?: string;
  fileBlobUrl?: string;
  filename?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'youtube' | 'instagram' | 'audio' | 'general';
}
