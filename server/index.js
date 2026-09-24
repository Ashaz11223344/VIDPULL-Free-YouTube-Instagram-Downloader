import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import os from 'os';
import youtubedl from 'youtube-dl-exec';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Standard desktop browser emulation headers to prevent 429 rate limits & bot blocks
const BROWSER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';
const STANDARD_HEADERS = [
  'Accept-Language: en-US,en;q=0.9',
  'Sec-Fetch-Mode: navigate',
];

// In-memory cache for fetch requests to speed up redundant requests
const fetchCache = new Map();
const CACHE_TTL = 3600 * 1000; // 1 hour

// Helper: Format bytes
function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 MB';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Helper: Format duration
function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '0:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const formattedSecs = secs < 10 ? `0${secs}` : `${secs}`;
  if (hrs > 0) {
    const formattedMins = mins < 10 ? `0${mins}` : `${mins}`;
    return `${hrs}:${formattedMins}:${formattedSecs}`;
  }
  return `${mins}:${formattedSecs}`;
}

// Helper: Format numbers
function formatNumber(num) {
  if (!num) return undefined;
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), engine: 'Vidpull yt-dlp Engine v1.0' });
});

// ==========================================
// YOUTUBE ENDPOINTS
// ==========================================
app.post('/api/youtube/fetch', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') return res.status(400).json({ error: 'URL is required' });
    const trimmed = url.trim();

    const cacheKey = `yt_${trimmed}`;
    if (fetchCache.has(cacheKey)) {
      const cached = fetchCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`[Vidpull Engine] Serving cached metadata for: ${trimmed}`);
        return res.json(cached.data);
      }
    }

    console.log(`[Vidpull Engine] Fetching YouTube metadata for: ${trimmed}`);

    const isPlaylistUrl = trimmed.includes('list=') || trimmed.includes('/playlist');
    const ytdlFlags = {
      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true,
      noCheckCertificates: true,
      userAgent: BROWSER_USER_AGENT,
      addHeader: STANDARD_HEADERS,
    };

    if (isPlaylistUrl) {
      ytdlFlags.flatPlaylist = true;
    } else {
      ytdlFlags.noPlaylist = true;
    }

    // Call youtube-dl-exec with resilient multi-client fallback
    let info;
    try {
      info = await youtubedl(trimmed, ytdlFlags);
    } catch (primaryErr) {
      console.warn(`[Vidpull Engine] Primary extraction failed, attempting iOS/Web client fallback:`, primaryErr.message || primaryErr);
      info = await youtubedl(trimmed, {
        ...ytdlFlags,
        extractorArgs: 'youtube:player_client=ios,web,mweb',
      });
    }

    const isPlaylist = info._type === 'playlist' || (info.entries && info.entries.length > 0);
    const duration = Math.round(info.duration || 0);
    const durationFormatted = formatDuration(duration);
    const title = info.title || (isPlaylist ? 'YouTube Playlist' : 'YouTube Video');
    const author = info.uploader || info.channel || info.creator || 'Creator';
    const thumbnail = info.thumbnail || (info.thumbnails && info.thumbnails.length > 0 ? info.thumbnails[info.thumbnails.length - 1].url : '');
    const uploadDate = info.upload_date 
      ? `${info.upload_date.slice(0, 4)}-${info.upload_date.slice(4, 6)}-${info.upload_date.slice(6, 8)}`
      : new Date().toISOString().split('T')[0];

    const viewsFormatted = info.view_count ? `${formatNumber(info.view_count)} views` : undefined;
    const likesFormatted = info.like_count ? `${formatNumber(info.like_count)} likes` : undefined;

    let playlistItems = undefined;
    if (isPlaylist && info.entries) {
      playlistItems = info.entries.slice(0, 50).map((entry, idx) => ({
        id: entry.id || `item_${idx + 1}`,
        index: idx + 1,
        title: entry.title || `Track ${idx + 1}`,
        url: entry.url || (entry.id ? `https://www.youtube.com/watch?v=${entry.id}` : trimmed),
        duration: Math.round(entry.duration || 0),
        durationFormatted: formatDuration(Math.round(entry.duration || 0)),
        author: entry.uploader || entry.channel || author,
        thumbnail: entry.thumbnail || (entry.thumbnails && entry.thumbnails.length > 0 ? entry.thumbnails[entry.thumbnails.length - 1].url : `https://i.ytimg.com/vi/${entry.id}/hqdefault.jpg`),
      }));
    }

    const rawFormats = info.formats || [];

    // Determine available resolutions
    const resolutions = [
      { id: 'yt-4k-mp4', quality: '4K Ultra HD (2160p)', resolution: '3840x2160', height: 2160, format: 'mp4', fps: 60, approxBytesPerSec: 5000000 },
      { id: 'yt-1440p-mp4', quality: '2K Quad HD (1440p)', resolution: '2560x1440', height: 1440, format: 'mp4', fps: 60, approxBytesPerSec: 3000000 },
      { id: 'yt-1080p-mp4', quality: '1080p Full HD (60fps)', resolution: '1920x1080', height: 1080, format: 'mp4', fps: 60, recommended: true, approxBytesPerSec: 1500000 },
      { id: 'yt-720p-mp4', quality: '720p HD (High Definition)', resolution: '1280x720', height: 720, format: 'mp4', fps: 30, approxBytesPerSec: 800000 },
      { id: 'yt-480p-mp4', quality: '480p Standard Definition', resolution: '854x480', height: 480, format: 'mp4', fps: 30, approxBytesPerSec: 400000 },
      { id: 'yt-360p-mp4', quality: '360p Mobile Optimized', resolution: '640x360', height: 360, format: 'mp4', fps: 30, approxBytesPerSec: 250000 },
      { id: 'yt-240p-mp4', quality: '240p Low Bandwidth', resolution: '426x240', height: 240, format: 'mp4', fps: 24, approxBytesPerSec: 150000 },
      { id: 'yt-144p-mp4', quality: '144p Data Saver', resolution: '256x144', height: 144, format: 'mp4', fps: 24, approxBytesPerSec: 80000 },
    ];

    const maxHeight = rawFormats.reduce((max, f) => Math.max(max, f.height || 0), 720);

    const formats = resolutions
      .filter(r => r.height <= Math.max(maxHeight, 720))
      .map(r => {
        const rawMatch = rawFormats.find(f => f.height === r.height && f.filesize);
        const sizeBytes = rawMatch?.filesize || (duration > 0 ? duration * r.approxBytesPerSec : r.approxBytesPerSec * 180);
        return {
          id: r.id,
          quality: r.quality,
          resolution: r.resolution,
          height: r.height,
          format: r.format,
          sizeFormatted: formatBytes(sizeBytes),
          sizeBytes,
          fps: r.fps,
          recommended: r.recommended,
          hasAudio: true,
        };
      });

    const audioFormats = [
      {
        id: 'yt-mp3-320', quality: '320 kbps (Studio Master Quality)', resolution: 'Audio MP3', height: 0, format: 'mp3', bitrate: '320kbps', sizeBytes: duration > 0 ? Math.round((duration * 320 * 1000) / 8) : 8800000, sizeFormatted: formatBytes(duration > 0 ? Math.round((duration * 320 * 1000) / 8) : 8800000), isAudioOnly: true,
      },
      {
        id: 'yt-mp3-256', quality: '256 kbps (High Fidelity)', resolution: 'Audio MP3', height: 0, format: 'mp3', bitrate: '256kbps', sizeBytes: duration > 0 ? Math.round((duration * 256 * 1000) / 8) : 7000000, sizeFormatted: formatBytes(duration > 0 ? Math.round((duration * 256 * 1000) / 8) : 7000000), isAudioOnly: true,
      },
      {
        id: 'yt-mp3-192', quality: '192 kbps (Standard Recommended)', resolution: 'Audio MP3', height: 0, format: 'mp3', bitrate: '192kbps', sizeBytes: duration > 0 ? Math.round((duration * 192 * 1000) / 8) : 5300000, sizeFormatted: formatBytes(duration > 0 ? Math.round((duration * 192 * 1000) / 8) : 5300000), isAudioOnly: true, recommended: true,
      },
      {
        id: 'yt-mp3-128', quality: '128 kbps (Compact Audio)', resolution: 'Audio MP3', height: 0, format: 'mp3', bitrate: '128kbps', sizeBytes: duration > 0 ? Math.round((duration * 128 * 1000) / 8) : 3500000, sizeFormatted: formatBytes(duration > 0 ? Math.round((duration * 128 * 1000) / 8) : 3500000), isAudioOnly: true,
      },
    ];

    const subtitles = [];
    if (info.subtitles) {
      for (const [lang, track] of Object.entries(info.subtitles)) {
        subtitles.push({
          lang,
          name: track[0]?.name || lang,
          isAuto: false
        });
      }
    }
    if (info.automatic_captions) {
      for (const [lang, track] of Object.entries(info.automatic_captions)) {
        if (!subtitles.some(s => s.lang === lang)) {
          subtitles.push({
            lang,
            name: (track[0]?.name || lang) + ' (Auto)',
            isAuto: true
          });
        }
      }
    }

    const resultData = {
      id: info.id || 'yt_media',
      originalUrl: trimmed,
      platform: 'youtube',
      title,
      author,
      thumbnail: thumbnail || (playlistItems && playlistItems[0] ? playlistItems[0].thumbnail : ''),
      duration,
      durationFormatted,
      uploadDate,
      viewsFormatted,
      likesFormatted,
      formats,
      audioFormats,
      subtitles: subtitles.slice(0, 20),
      isPlaylist,
      playlistCount: playlistItems ? playlistItems.length : 0,
      playlistItems,
    };

    fetchCache.set(cacheKey, { timestamp: Date.now(), data: resultData });
    return res.json(resultData);

  } catch (error) {
    console.error('[Vidpull Engine] YouTube Fetch error:', error.message || error);
    res.status(500).json({ error: error.message || 'Failed to fetch YouTube metadata' });
  }
});

// ==========================================
// INSTAGRAM ENDPOINTS
// ==========================================
app.post('/api/instagram/fetch', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') return res.status(400).json({ error: 'URL is required' });
    const trimmed = url.trim();

    const cacheKey = `ig_${trimmed}`;
    if (fetchCache.has(cacheKey)) {
      const cached = fetchCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`[Vidpull Engine] Serving cached metadata for: ${trimmed}`);
        return res.json(cached.data);
      }
    }

    console.log(`[Vidpull Engine] Fetching Instagram metadata for: ${trimmed}`);

    const info = await youtubedl(trimmed, {
      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true,
      noCheckCertificates: true,
      userAgent: BROWSER_USER_AGENT,
      addHeader: [
        ...STANDARD_HEADERS,
        'Referer: https://www.instagram.com/',
      ],
    });

    const duration = Math.round(info.duration || 0);
    const durationFormatted = formatDuration(duration);
    const title = info.title || 'Instagram Media';
    const author = info.uploader || info.channel || info.creator || '@instagram_user';
    const thumbnail = info.thumbnail || (info.thumbnails && info.thumbnails.length > 0 ? info.thumbnails[info.thumbnails.length - 1].url : '');
    const uploadDate = info.upload_date 
      ? `${info.upload_date.slice(0, 4)}-${info.upload_date.slice(4, 6)}-${info.upload_date.slice(6, 8)}`
      : new Date().toISOString().split('T')[0];
    const viewsFormatted = info.view_count ? `${formatNumber(info.view_count)} views` : undefined;
    const likesFormatted = info.like_count ? `${formatNumber(info.like_count)} likes` : undefined;

    const isCarousel = info._type === 'playlist' || (info.entries && info.entries.length > 0);
    let carouselItems = undefined;

    if (isCarousel && info.entries) {
      carouselItems = info.entries.map((entry, idx) => ({
        id: `slide-${idx + 1}`,
        type: entry.ext === 'mp4' || entry.vcodec !== 'none' ? 'video' : 'image',
        url: entry.url || trimmed,
        previewUrl: entry.thumbnail || thumbnail,
        resolution: entry.height ? `${entry.width || 1080}x${entry.height}` : '1080x1350',
        sizeFormatted: entry.filesize ? formatBytes(entry.filesize) : '12.0 MB',
      }));
    }

    const formats = [
      {
        id: 'ig-1080p', quality: '1080p HD (Highest Quality)', resolution: '1080x1920', height: 1080, format: 'mp4', sizeFormatted: info.filesize ? formatBytes(info.filesize) : '24.5 MB', sizeBytes: info.filesize || 25690112, fps: 30, recommended: true, hasAudio: true,
      },
      {
        id: 'ig-720p', quality: '720p Standard Video', resolution: '720x1280', height: 720, format: 'mp4', sizeFormatted: info.filesize ? formatBytes(Math.round(info.filesize / 2)) : '12.2 MB', sizeBytes: info.filesize ? Math.round(info.filesize / 2) : 12845056, fps: 30, hasAudio: true,
      },
    ];

    const resultData = {
      id: info.id || 'ig_media', originalUrl: trimmed, platform: 'instagram', title, author, thumbnail, duration: duration || 30, durationFormatted: durationFormatted || '0:30', uploadDate, viewsFormatted, likesFormatted, formats, audioFormats: [], carouselItems,
    };

    fetchCache.set(cacheKey, { timestamp: Date.now(), data: resultData });
    return res.json(resultData);

  } catch (error) {
    console.error('[Vidpull Engine] Instagram Fetch error:', error.message || error);
    res.status(500).json({ error: error.message || 'Failed to fetch Instagram metadata' });
  }
});


function sanitizeTimestamp(ts, defaultVal) {
  if (!ts || typeof ts !== 'string') return defaultVal;
  const parts = ts.trim().split(':').map(p => p.padStart(2, '0'));
  if (parts.length === 2) {
    return `00:${parts[0]}:${parts[1]}`;
  }
  if (parts.length === 3) {
    return `${parts[0]}:${parts[1]}:${parts[2]}`;
  }
  return defaultVal;
}

// ==========================================
// CORE DOWNLOAD HANDLER
// ==========================================
const handleDownload = async (req, res, platform) => {
  req.socket.setKeepAlive(true, 10000);
  req.socket.setTimeout(0);
  res.setTimeout(0);

  const { url, format, height, isAudio, title, startTime, endTime, isSubtitle, subLang, subFormat } = req.query;

  if (!url) return res.status(400).send('URL query parameter is required');

  const cleanTitle = (title ? String(title) : 'vidpull_media').replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').substring(0, 50);

  // Subtitle download path
  if (isSubtitle === 'true') {
    const lang = subLang ? String(subLang) : 'en';
    const subExt = subFormat === 'vtt' ? 'vtt' : 'srt';
    const targetFilename = `${cleanTitle}_${lang}.${subExt}`;
    const safeSubFilename = targetFilename.replace(/[^a-zA-Z0-9_.-]/g, '_');

    const tempDir = path.join(os.tmpdir(), `vidpull_sub_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      const outputTemplate = path.join(tempDir, `sub.%(ext)s`);
      await youtubedl(String(url), {
        skipDownload: true,
        writeSub: true,
        writeAutoSub: true,
        subLang: lang,
        subFormat: subExt,
        output: outputTemplate,
        noWarnings: true,
        noCheckCertificates: true,
        userAgent: BROWSER_USER_AGENT,
        addHeader: STANDARD_HEADERS,
      });

      const files = fs.readdirSync(tempDir);
      if (!files || files.length === 0) throw new Error('No subtitle file found for selected language.');

      const downloadedFile = files.find(f => f.endsWith(`.${subExt}`) || f.includes(lang)) || files[0];
      const filePath = path.join(tempDir, downloadedFile);
      const stat = fs.statSync(filePath);

      res.setHeader('Content-Disposition', `attachment; filename="${safeSubFilename}"; filename*=UTF-8''${encodeURIComponent(targetFilename)}`);
      res.setHeader('Content-Type', subExt === 'vtt' ? 'text/vtt' : 'application/x-subrip');
      res.setHeader('Content-Length', stat.size);

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      const cleanup = () => {
        try { if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
      };
      res.on('finish', cleanup);
      res.on('close', cleanup);
      return;
    } catch (error) {
      console.error('[Vidpull Engine] Subtitle download error:', error.message || error);
      try { if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
      if (!res.headersSent) res.status(500).json({ error: error.message || 'Failed to download subtitle' });
      return;
    }
  }

  const isAudioDownload = isAudio === 'true' || format === 'mp3';
  const targetExt = isAudioDownload ? 'mp3' : (format === 'webm' ? 'webm' : 'mp4');
  const targetFilename = `${cleanTitle}.${targetExt}`;
  const safeFilename = targetFilename.replace(/[^a-zA-Z0-9_.-]/g, '_');
  
  const tempDir = path.join(os.tmpdir(), `vidpull_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);
  fs.mkdirSync(tempDir, { recursive: true });

  console.log(`[Vidpull Engine] Starting ${platform} download for "${url}" into ${tempDir}`);

  try {
    const outputTemplate = path.join(tempDir, `media.%(ext)s`);

    const ytdlOptions = {
      output: outputTemplate,
      noWarnings: true,
      noCheckCertificates: true,
      userAgent: BROWSER_USER_AGENT,
      addHeader: platform === 'instagram'
        ? [...STANDARD_HEADERS, 'Referer: https://www.instagram.com/']
        : STANDARD_HEADERS,
    };

    if (startTime && endTime) {
      const cleanStart = sanitizeTimestamp(startTime, '00:00:00');
      const cleanEnd = sanitizeTimestamp(endTime, '00:05:00');
      ytdlOptions.downloadSections = `*${cleanStart}-${cleanEnd}`;
      ytdlOptions.forceKeyframesAtCuts = true;
    }

    if (isAudioDownload) {
      ytdlOptions.extractAudio = true;
      ytdlOptions.audioFormat = 'mp3';
      ytdlOptions.audioQuality = '0';
    } else {
      const h = parseInt(String(height || '1080'), 10);
      ytdlOptions.format = h > 0 
        ? `bestvideo[height<=${h}]+bestaudio/best[height<=${h}]/best`
        : 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
    }

    await youtubedl(String(url), ytdlOptions);

    const files = fs.readdirSync(tempDir);
    if (!files || files.length === 0) throw new Error('No downloaded media file was generated.');

    const downloadedFile = files.find(f => !f.endsWith('.part')) || files[0];
    const filePath = path.join(tempDir, downloadedFile);
    const stat = fs.statSync(filePath);

    console.log(`[Vidpull Engine] Download complete. File: ${downloadedFile}, Size: ${stat.size} bytes`);

    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(targetFilename)}`);
    res.setHeader('Content-Type', isAudioDownload ? 'audio/mpeg' : 'video/mp4');
    res.setHeader('Content-Length', stat.size);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    const cleanup = () => {
      try {
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {}
    };

    res.on('finish', cleanup);
    res.on('close', cleanup);
  } catch (error) {
    console.error(`[Vidpull Engine] ${platform} Download execution error:`, error.message || error);
    try {
      if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}

    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Download execution failed' });
    }
  }
};

app.get('/api/youtube/download', (req, res) => handleDownload(req, res, 'youtube'));
app.get('/api/instagram/download', (req, res) => handleDownload(req, res, 'instagram'));

// Serve frontend build if dist folder exists (Unified full-stack single server)
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const server = app.listen(PORT, () => {
  console.log(`Vidpull backend server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Vidpull Engine] Error: Port ${PORT} is already in use by another process.`);
  } else {
    console.error(`[Vidpull Engine] Server error:`, err);
  }
  process.exit(1);
});

server.timeout = 0;
server.keepAliveTimeout = 600000;
server.headersTimeout = 600000;

