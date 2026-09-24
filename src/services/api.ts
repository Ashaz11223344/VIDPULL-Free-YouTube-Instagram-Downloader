import type { VideoMetadata, MediaFormat, DownloadProgressState } from '../types';
import { validateMediaUrl } from '../utils/validation';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/**
 * Fetch real video / media metadata from backend using yt-dlp
 */
export async function fetchMediaInfo(url: string): Promise<VideoMetadata> {
  const validation = validateMediaUrl(url);
  if (!validation.isValid) {
    throw new Error(validation.errorMessage || 'Invalid URL entered');
  }

  const trimmed = url.trim();

  try {
    const platformPath = validation.platform === 'instagram' ? 'instagram' : 'youtube';
    const endpoint = `${API_BASE}/api/${platformPath}/fetch`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: trimmed }),
    });

    if (response.ok) {
      const data: VideoMetadata = await response.json();
      return data;
    }

    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server error (${response.status})`);
  } catch (backendError: any) {
    console.error('[Vidpull] Fetch error:', backendError.message);
    throw backendError;
  }
}

/**
 * Executes REAL progressive file download from the backend engine.
 * Streams real video/audio bytes into browser blob and saves to disk.
 */
export async function downloadMediaFile(
  metadata: VideoMetadata,
  format: MediaFormat,
  onProgress: (state: DownloadProgressState) => void,
  abortSignal?: AbortSignal,
  trimRange?: { start: string; end: string },
  subtitleOptions?: { lang: string; format: 'srt' | 'vtt' }
): Promise<{ blobUrl: string; filename: string }> {
  const cleanTitle = metadata.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
  const ext = subtitleOptions ? subtitleOptions.format : format.format;
  const filename = subtitleOptions 
    ? `Vidpull_${cleanTitle}_${subtitleOptions.lang}.${ext}` 
    : `Vidpull_${cleanTitle}_${format.id}.${ext}`;

  onProgress({
    isDownloading: true,
    progress: 5,
    status: 'preparing',
    speed: 'Initializing stream...',
    downloadedBytes: 0,
    totalBytes: format.sizeBytes || 15000000,
    etaSeconds: 5,
    filename,
  });

  const queryParams = new URLSearchParams({
    url: format.url || metadata.originalUrl,
    format: format.format,
    height: String(format.height || 1080),
    isAudio: format.isAudioOnly ? 'true' : 'false',
    title: metadata.title,
  });

  if (trimRange && trimRange.start && trimRange.end) {
    queryParams.set('startTime', trimRange.start);
    queryParams.set('endTime', trimRange.end);
  }

  if (subtitleOptions) {
    queryParams.set('isSubtitle', 'true');
    queryParams.set('subLang', subtitleOptions.lang);
    queryParams.set('subFormat', subtitleOptions.format);
  }

  const endpointPlatform = metadata.platform === 'instagram' ? 'instagram' : 'youtube';
  const downloadUrl = `${API_BASE}/api/${endpointPlatform}/download?${queryParams.toString()}`;
  const startTime = Date.now();

  try {
    const response = await fetch(downloadUrl, {
      signal: abortSignal,
    });

    if (!response.ok) {
      throw new Error(`Server returned error ${response.status}: ${response.statusText}`);
    }

    const contentLengthHeader = response.headers.get('Content-Length');
    const totalBytes = contentLengthHeader ? parseInt(contentLengthHeader, 10) : (format.sizeBytes || 15000000);

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let receivedBytes = 0;

    while (true) {
      if (abortSignal?.aborted) {
        reader.cancel();
        throw new Error('Download cancelled');
      }

      const { done, value } = await reader.read();
      if (done) break;

      if (value) {
        chunks.push(value);
        receivedBytes += value.length;

        const progress = Math.min(99, Math.round((receivedBytes / (totalBytes || 1)) * 100));
        const elapsedSec = Math.max(0.1, (Date.now() - startTime) / 1000);
        const bytesPerSec = receivedBytes / elapsedSec;
        const speedMBs = (bytesPerSec / (1024 * 1024)).toFixed(1);
        const remainingBytes = Math.max(0, totalBytes - receivedBytes);
        const etaSeconds = Math.ceil(remainingBytes / (bytesPerSec || 1));

        onProgress({
          isDownloading: true,
          progress,
          status: 'downloading',
          speed: `${speedMBs} MB/s`,
          downloadedBytes: receivedBytes,
          totalBytes,
          etaSeconds,
          filename,
        });
      }
    }

    if (format.isAudioOnly) {
      onProgress({
        isDownloading: true,
        progress: 99,
        status: 'converting',
        speed: 'Processing MP3 tags...',
        downloadedBytes: receivedBytes,
        totalBytes: receivedBytes,
        etaSeconds: 1,
        filename,
      });
      await new Promise(r => setTimeout(r, 200));
    }

    // Assemble real binary blob from actual received chunks!
    const blob = new Blob(chunks as BlobPart[], {
      type: format.format === 'mp3' ? 'audio/mpeg' : (format.format === 'webm' ? 'video/webm' : 'video/mp4'),
    });

    const blobUrl = URL.createObjectURL(blob);

    // Trigger browser file download dialog
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    onProgress({
      isDownloading: false,
      progress: 100,
      status: 'completed',
      speed: 'Done!',
      downloadedBytes: receivedBytes,
      totalBytes: receivedBytes,
      etaSeconds: 0,
      fileBlobUrl: blobUrl,
      filename,
    });

    return { blobUrl, filename };
  } catch (error: any) {
    if (error.name === 'AbortError' || error.message === 'Download cancelled') {
      onProgress({
        isDownloading: false,
        progress: 0,
        status: 'cancelled',
        speed: '0 MB/s',
        downloadedBytes: 0,
        totalBytes: format.sizeBytes,
        etaSeconds: 0,
        errorMessage: 'Download cancelled by user',
      });
      throw new Error('Download cancelled');
    }

    console.error('[Vidpull Download Error]:', error);

    onProgress({
      isDownloading: false,
      progress: 0,
      status: 'error',
      speed: '0 MB/s',
      downloadedBytes: 0,
      totalBytes: format.sizeBytes,
      etaSeconds: 0,
      errorMessage: error.message || 'Download failed from backend',
    });

    throw error;
  }
}

