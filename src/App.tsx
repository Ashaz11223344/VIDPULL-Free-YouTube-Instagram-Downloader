import { useState, useRef } from 'react';
import { Header } from './components/Header';
import { MarqueeBanner } from './components/MarqueeBanner';
import { InputSection } from './components/InputSection';
import { ResultCard } from './components/ResultCard';
import { DownloadModal } from './components/DownloadModal';
import { DownloadHistory } from './components/DownloadHistory';
import { FeaturesSection } from './components/FeaturesSection';
import { FAQSection } from './components/FAQSection';
import { LegalModals } from './components/LegalModals';
import { Footer } from './components/Footer';

import { useLocalStorage } from './hooks/useLocalStorage';
import type { 
  VideoMetadata, 
  MediaFormat, 
  DownloadProgressState, 
  DownloadHistoryItem, 
  InstagramCarouselItem 
} from './types';
import { fetchMediaInfo, downloadMediaFile } from './services/api';

export function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);

  // Download state
  const [activeFormat, setActiveFormat] = useState<MediaFormat | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgressState>({
    isDownloading: false,
    progress: 0,
    status: 'preparing',
    speed: '0 MB/s',
    downloadedBytes: 0,
    totalBytes: 0,
    etaSeconds: 0,
  });

  // Local storage download history
  const [history, setHistory] = useLocalStorage<DownloadHistoryItem[]>('vidpull_history', []);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Legal modal state
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | 'dmca' | null>(null);

  // Abort controller reference for download cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  // Fetch metadata handler
  const handleFetch = async (urlToFetch?: string) => {
    const targetUrl = urlToFetch || url;
    if (!targetUrl.trim()) return;

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const data = await fetchMediaInfo(targetUrl);
      setMetadata(data);
      // Smooth scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resolve media. Please check URL.');
      setMetadata(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Download handler
  const handleDownload = async (
    format: MediaFormat,
    trimRange?: { start: string; end: string },
    subtitleOptions?: { lang: string; format: 'srt' | 'vtt' }
  ) => {
    if (!metadata) return;

    setActiveFormat(format);
    setIsModalOpen(true);
    abortControllerRef.current = new AbortController();

    try {
      const result = await downloadMediaFile(
        metadata,
        format,
        (state) => setDownloadProgress(state),
        abortControllerRef.current.signal,
        trimRange,
        subtitleOptions
      );

      // Save to download history (limit to 10 items)
      const newHistoryItem: DownloadHistoryItem = {
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        originalUrl: metadata.originalUrl,
        title: metadata.title,
        platform: metadata.platform,
        format: subtitleOptions ? subtitleOptions.format.toUpperCase() : format.format.toUpperCase(),
        quality: subtitleOptions ? `Sub (${subtitleOptions.lang})` : format.quality,
        timestamp: Date.now(),
        thumbnail: metadata.thumbnail,
        fileSize: format.sizeFormatted,
        filename: result.filename,
      };

      setHistory(prev => [newHistoryItem, ...prev.filter(i => i.originalUrl !== metadata.originalUrl)].slice(0, 10));
    } catch (err: any) {
      if (err.message !== 'Download cancelled') {
        setDownloadProgress(prev => ({
          ...prev,
          isDownloading: false,
          status: 'error',
          errorMessage: err.message || 'Download failed. Please try again.',
        }));
      }
    }
  };

  // Instagram carousel individual slide download
  const handleDownloadCarouselItem = async (item: InstagramCarouselItem) => {
    if (!metadata) return;
    const format: MediaFormat = {
      id: item.id,
      quality: item.resolution || 'Original Quality',
      resolution: item.resolution || '1080x1920',
      height: 1080,
      format: item.type === 'video' ? 'mp4' : 'mp4',
      sizeFormatted: item.sizeFormatted || '12.0 MB',
      sizeBytes: 12582912,
    };
    handleDownload(format);
  };

  const handleCancelDownload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleRemoveHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(i => i.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg bg-grid flex flex-col text-black selection:bg-neo-accent selection:text-black">
      
      {/* Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onScrollToFeatures={() => scrollToSection('features')}
        onScrollToFAQ={() => scrollToSection('faq')}
      />

      {/* Ticker Banner */}
      <MarqueeBanner />

      {/* Main Content */}
      <main className="flex-1">
        {/* Input Hero Section */}
        <InputSection
          url={url}
          setUrl={setUrl}
          onFetch={handleFetch}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onClearError={() => setErrorMessage(undefined)}
        />

        {/* Results Section */}
        <div ref={resultRef}>
          {metadata && (
            <ResultCard
              metadata={metadata}
              onDownload={handleDownload}
              onDownloadCarouselItem={handleDownloadCarouselItem}
            />
          )}
        </div>

        {/* Feature Highlights Section */}
        <FeaturesSection />

        {/* Reverse Marquee Separator */}
        <MarqueeBanner reverse />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer onOpenLegal={(type) => setLegalModalType(type)} />

      {/* Active Download Progress Modal */}
      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCancel={handleCancelDownload}
        onRedownload={() => activeFormat && handleDownload(activeFormat)}
        state={downloadProgress}
        metadata={metadata}
        format={activeFormat}
      />

      {/* Download History Slide-Over Drawer */}
      <DownloadHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onRemoveItem={handleRemoveHistoryItem}
        onReFetch={(u) => {
          setUrl(u);
          handleFetch(u);
        }}
      />

      {/* Legal & DMCA Modals */}
      <LegalModals
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

    </div>
  );
}

export default App;
