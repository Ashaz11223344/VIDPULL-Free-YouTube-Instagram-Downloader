import type { FAQItem } from '../types';

export const DEMO_PRESETS = [
  {
    label: '4K Synthwave Music',
    platform: 'youtube' as const,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tag: '4K / 60FPS',
    type: 'video',
  },
  {
    label: 'Tech Review Reel',
    platform: 'instagram' as const,
    url: 'https://www.instagram.com/reel/C3bL12xP3Q4/',
    tag: '1080p REEL',
    type: 'reel',
  },
  {
    label: 'Podcast Audio (MP3)',
    platform: 'youtube' as const,
    url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    tag: '320kbps MP3',
    type: 'audio',
  },
  {
    label: 'Travel Carousel Post',
    platform: 'instagram' as const,
    url: 'https://www.instagram.com/p/C0eZkLM9O1p/',
    tag: 'ALBUM / 4 ITEMS',
    type: 'carousel',
  },
];

export const FAQS: FAQItem[] = [
  {
    category: 'general',
    question: 'IS VIDPULL COMPLETELY FREE TO USE?',
    answer: 'Yes! Vidpull is 100% free with no registration, no paywalls, and no hidden subscriptions. You can download unlimited videos and MP3 tracks directly to your device.',
  },
  {
    category: 'youtube',
    question: 'WHAT QUALITY OPTIONS ARE AVAILABLE FOR YOUTUBE VIDEOS?',
    answer: 'We support all resolutions made available by YouTube, including 4K Ultra HD (2160p), 2K (1440p), 1080p Full HD, 720p HD, 480p, and 360p in both MP4 and WebM formats with smooth 60fps frame rates.',
  },
  {
    category: 'audio',
    question: 'HOW DOES YOUTUBE TO MP3 AUDIO CONVERSION WORK?',
    answer: 'Select the "Audio (MP3)" tab on any YouTube video result card. You can pick your desired bitrate from studio-grade 320kbps down to standard 128kbps. The audio is extracted with complete metadata and embedded cover art.',
  },
  {
    category: 'instagram',
    question: 'CAN I DOWNLOAD INSTAGRAM REELS AND MULTI-IMAGE/VIDEO CAROUSELS?',
    answer: 'Yes! Simply paste any Instagram post link, Reel URL, or Story link. If the post contains multiple photos or videos (carousel), Vidpull extracts every slide so you can download items individually or as a complete bundle.',
  },
  {
    category: 'general',
    question: 'WHERE ARE THE DOWNLOADED FILES SAVED ON MY DEVICE?',
    answer: 'Files are saved directly to your browser’s default "Downloads" folder (or mobile camera roll / files app depending on your device settings). No data is stored on our servers.',
  },
  {
    category: 'general',
    question: 'IS IT LEGAL TO DOWNLOAD VIDEOS WITH VIDPULL?',
    answer: 'Vidpull is designed strictly for personal, non-commercial use, and offline viewing of content you have rights to access. Always respect the copyright and intellectual property rights of content creators.',
  },
];

export const MARQUEE_ITEMS = [
  '⚡ UNLIMITED HIGH-SPEED DOWNLOADS',
  '🎬 4K 60FPS YOUTUBE VIDEOS',
  '📱 INSTAGRAM REELS & CAROUSELS',
  '🎵 320KBPS CRYSTAL CLEAR MP3',
  '🔒 100% PRIVATE & ANONYMOUS',
  '⚡ NO REGISTRATION NEEDED',
  '🚀 FASTEST EXTRACTION ENGINE',
];
