import type { PlatformType } from '../types';

export interface ValidationResult {
  isValid: boolean;
  platform: PlatformType;
  id?: string;
  isShort?: boolean;
  isPlaylist?: boolean;
  isReel?: boolean;
  isStory?: boolean;
  errorMessage?: string;
}

export function detectPlatform(url: string): PlatformType {
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.includes('youtube.com') ||
    trimmed.includes('youtu.be') ||
    trimmed.includes('music.youtube.com')
  ) {
    return 'youtube';
  }
  if (
    trimmed.includes('instagram.com') ||
    trimmed.includes('instagr.am')
  ) {
    return 'instagram';
  }
  return 'unknown';
}

export function validateMediaUrl(url: string): ValidationResult {
  const trimmed = url.trim();

  if (!trimmed) {
    return {
      isValid: false,
      platform: 'unknown',
      errorMessage: 'Please enter a video URL',
    };
  }

  try {
    new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
  } catch {
    return {
      isValid: false,
      platform: 'unknown',
      errorMessage: 'Please enter a valid web URL (e.g., https://youtube.com/...)',
    };
  }

  const platform = detectPlatform(trimmed);

  if (platform === 'youtube') {
    const ytStandard = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const ytShorts = /youtube\.com\/shorts\/([^"&?/\s]{11})/;
    const ytPlaylist = /[?&]list=([a-zA-Z0-9_-]+)/;

    const shortMatch = trimmed.match(ytShorts);
    if (shortMatch) {
      return {
        isValid: true,
        platform: 'youtube',
        id: shortMatch[1],
        isShort: true,
      };
    }

    const playlistMatch = trimmed.match(ytPlaylist);
    const standardMatch = trimmed.match(ytStandard);

    if (playlistMatch && !standardMatch) {
      return {
        isValid: true,
        platform: 'youtube',
        id: playlistMatch[1],
        isPlaylist: true,
      };
    }

    if (standardMatch) {
      return {
        isValid: true,
        platform: 'youtube',
        id: standardMatch[1],
        isPlaylist: Boolean(playlistMatch),
      };
    }

    return {
      isValid: false,
      platform: 'youtube',
      errorMessage: 'Invalid YouTube link format. Supported: youtube.com/watch?v=..., youtu.be/..., shorts/...',
    };
  }

  if (platform === 'instagram') {
    const igPost = /instagram\.com\/(?:p|tv)\/([a-zA-Z0-9_-]+)/;
    const igReel = /instagram\.com\/reel\/([a-zA-Z0-9_-]+)/;
    const igStory = /instagram\.com\/stories\/([a-zA-Z0-9_.-]+)\/([0-9]+)/;

    const reelMatch = trimmed.match(igReel);
    if (reelMatch) {
      return {
        isValid: true,
        platform: 'instagram',
        id: reelMatch[1],
        isReel: true,
      };
    }

    const postMatch = trimmed.match(igPost);
    if (postMatch) {
      return {
        isValid: true,
        platform: 'instagram',
        id: postMatch[1],
      };
    }

    const storyMatch = trimmed.match(igStory);
    if (storyMatch) {
      return {
        isValid: true,
        platform: 'instagram',
        id: storyMatch[2] || storyMatch[1],
        isStory: true,
      };
    }

    if (trimmed.includes('instagram.com/')) {
      return {
        isValid: true,
        platform: 'instagram',
        id: 'ig_post',
      };
    }

    return {
      isValid: false,
      platform: 'instagram',
      errorMessage: 'Invalid Instagram link. Supported: instagram.com/p/..., /reel/..., /stories/...',
    };
  }

  return {
    isValid: false,
    platform: 'unknown',
    errorMessage: 'Unsupported platform. Please enter a valid YouTube or Instagram URL.',
  };
}
