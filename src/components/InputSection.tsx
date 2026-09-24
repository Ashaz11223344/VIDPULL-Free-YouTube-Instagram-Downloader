import React, { useState, useEffect } from 'react';
import { 
  ArrowRightRegular, 
  ClipboardPasteRegular, 
  DismissRegular, 
  SparkleRegular, 
  CheckmarkCircleRegular, 
  WarningRegular,
  ArrowSyncRegular,
  FlashRegular,
  FireRegular
} from '@fluentui/react-icons';
import { YoutubeIcon, InstagramIcon } from './BrandIcons';
import { detectPlatform, validateMediaUrl } from '../utils/validation';
import { DEMO_PRESETS } from '../utils/constants';

interface InputSectionProps {
  url: string;
  setUrl: (url: string) => void;
  onFetch: (urlToFetch?: string) => void;
  isLoading: boolean;
  errorMessage?: string;
  onClearError: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  url,
  setUrl,
  onFetch,
  isLoading,
  errorMessage,
  onClearError,
}) => {
  const [platform, setPlatform] = useState<'youtube' | 'instagram' | 'unknown'>('unknown');
  const [isValidFormat, setIsValidFormat] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'youtube' | 'instagram'>('youtube');
  const [localError, setLocalError] = useState<string>('');

  useEffect(() => {
    if (url.trim()) {
      const p = detectPlatform(url);
      setPlatform(p);
      const validation = validateMediaUrl(url);
      setIsValidFormat(validation.isValid);

      if (p !== 'unknown') {
        setSelectedPlatform(p);
        setLocalError('');
      } else {
        setLocalError('');
      }
    } else {
      setPlatform('unknown');
      setIsValidFormat(false);
      setLocalError('');
    }
  }, [url]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        onClearError();
      }
    } catch {
      console.warn('Could not read from clipboard directly');
    }
  };

  const handleClear = () => {
    setUrl('');
    setLocalError('');
    onClearError();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;
    
    if (platform !== 'unknown' && platform !== selectedPlatform) {
      setLocalError(`You selected ${selectedPlatform === 'youtube' ? 'YouTube' : 'Instagram'}. Please switch to ${platform === 'youtube' ? 'YouTube' : 'Instagram'} to download this link.`);
      return;
    }
    
    onFetch();
  };

  const handlePresetClick = (presetUrl: string) => {
    setUrl(presetUrl);
    onClearError();
    onFetch(presetUrl);
  };

  return (
    <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Background Decorative Floating Stickers */}
      <div className="absolute -top-6 right-4 hidden lg:flex items-center gap-2 bg-neo-secondary border-4 border-black px-4 py-2 rotate-3 shadow-neo font-black uppercase text-sm z-10">
        <FlashRegular className="w-5 h-5 text-black" />
        <span>4K • 60FPS • 320KBPS</span>
      </div>

      <div className="absolute top-1/2 -left-8 hidden xl:flex items-center gap-2 bg-neo-muted border-4 border-black px-3 py-1.5 -rotate-6 shadow-neo-sm font-black uppercase text-xs">
        <FireRegular className="w-4 h-4 text-black" />
        <span>INSTANT ENGINE</span>
      </div>

      {/* Hero Headline */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-white border-4 border-black px-4 py-1.5 shadow-neo-sm mb-6 -rotate-1">
          <SparkleRegular className="w-4 h-4 text-neo-accent" />
          <span className="font-black text-xs md:text-sm uppercase tracking-widest">
            THE DIGITAL PUNK VIDEO EXTRACTOR
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none text-black mb-4">
          PULL ANY VIDEO <br className="hidden sm:block" />
          <span className="bg-neo-secondary px-3 sm:px-4 py-1 border-4 border-black inline-block rotate-1 shadow-neo my-1">
            OR AUDIO
          </span>{' '}
          INSTANTLY
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-xl font-bold text-black/80 mt-4">
          Download high-resolution YouTube videos up to 4K, extract studio 320kbps MP3 audio, and save Instagram Reels & Carousels. 100% Free & No registration required.
        </p>
      </div>

      {/* Input Box Component */}
      <div className="relative z-20 max-w-4xl mx-auto flex flex-col gap-4">
        
        {/* Platform Toggles */}
        <div className="flex justify-center gap-4 mb-2">
          <button
            type="button"
            onClick={() => {
              setSelectedPlatform('youtube');
              if (url && platform === 'instagram') {
                setLocalError('You selected YouTube. Please switch to Instagram to download this link.');
              }
            }}
            className={`flex items-center gap-2 px-6 py-3 border-4 border-black font-black uppercase tracking-wider transition-all shadow-neo-sm hover:-translate-y-1 ${
              selectedPlatform === 'youtube'
                ? 'bg-red-600 text-white'
                : 'bg-white text-black hover:bg-neo-secondary'
            }`}
          >
            <YoutubeIcon className="w-5 h-5" />
            <span>YouTube</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              setSelectedPlatform('instagram');
              if (url && platform === 'youtube') {
                setLocalError('You selected Instagram. Please switch to YouTube to download this link.');
              }
            }}
            className={`flex items-center gap-2 px-6 py-3 border-4 border-black font-black uppercase tracking-wider transition-all shadow-neo-sm hover:-translate-y-1 ${
              selectedPlatform === 'instagram'
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 text-white'
                : 'bg-white text-black hover:bg-neo-secondary'
            }`}
          >
            <InstagramIcon className="w-5 h-5" />
            <span>Instagram</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="bg-white border-4 border-black p-3 sm:p-4 shadow-neo-xl">
          <div className="relative flex flex-col md:flex-row items-stretch gap-3">
            
            {/* Input Container */}
            <div className="relative flex-1 flex items-center">
              {/* Platform Detection Icon Badge */}
              <div className="absolute left-3.5 z-10 flex items-center">
                {platform === 'youtube' ? (
                  <span className="flex items-center gap-1.5 bg-red-600 text-white border-2 border-black px-2 py-0.5 text-xs font-black uppercase tracking-wider">
                    <YoutubeIcon className="w-4 h-4" />
                    <span>YouTube</span>
                  </span>
                ) : platform === 'instagram' ? (
                  <span className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 text-white border-2 border-black px-2 py-0.5 text-xs font-black uppercase tracking-wider">
                    <InstagramIcon className="w-4 h-4" />
                    <span>Instagram</span>
                  </span>
                ) : (
                  <div className="bg-neo-bg border-2 border-black p-1 text-black">
                    <FlashRegular className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Text Input */}
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  onClearError();
                }}
                placeholder="Paste YouTube or Instagram link here..."
                disabled={isLoading}
                className="w-full h-14 sm:h-16 pl-32 pr-20 bg-neo-bg border-4 border-black font-bold text-base sm:text-lg text-black placeholder:text-black/40 focus:bg-neo-secondary focus:outline-none focus:ring-0 focus:shadow-neo-sm transition-all duration-150"
              />

              {/* Actions inside input (Paste & Clear) */}
              <div className="absolute right-3 flex items-center gap-1.5">
                {url ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 bg-white border-2 border-black hover:bg-neo-accent hover:text-white transition-colors"
                    title="Clear input"
                  >
                    <DismissRegular className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="flex items-center gap-1 bg-white border-2 border-black px-2.5 py-1 text-xs font-black uppercase hover:bg-neo-secondary transition-colors"
                    title="Paste from clipboard"
                  >
                    <ClipboardPasteRegular className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">PASTE</span>
                  </button>
                )}
                {isValidFormat && !isLoading && (
                  <CheckmarkCircleRegular className="w-5 h-5 text-green-600" />
                )}
              </div>
            </div>

            {/* Submit Action CTA Button */}
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="h-14 sm:h-16 px-6 sm:px-8 bg-neo-accent text-white border-4 border-black font-black text-lg sm:text-xl uppercase tracking-wider shadow-neo neo-btn hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <ArrowSyncRegular className="w-6 h-6 animate-spin" />
                  <span>FETCHING...</span>
                </>
              ) : (
                <>
                  <span>FETCH MEDIA</span>
                  <ArrowRightRegular className="w-6 h-6" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading State Banner */}
        {isLoading && (
          <div className="my-8 bg-neo-secondary border-4 border-black p-6 shadow-neo-sm overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-2 bg-black border-b-4 border-black">
              <div className="h-full bg-neo-accent w-1/3 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] origin-left" />
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left mt-2">
              <div className="p-3 bg-white border-4 border-black shadow-neo-xs animate-bounce">
                <FlashRegular className="w-8 h-8 text-black" />
              </div>
              
              <div>
                <h3 className="font-black text-2xl uppercase tracking-widest text-black animate-pulse flex items-center gap-2 justify-center md:justify-start">
                  Fetching Media <span className="flex gap-1"><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span><span className="animate-bounce delay-300">.</span></span>
                </h3>
                <p className="font-bold text-sm uppercase text-black/80 mt-1">
                  Tip: MP4 is the best format for playing on phones and TVs!
                </p>
              </div>
            </div>
            
            {/* Background Decorative lines */}
            <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 pointer-events-none">
              <FireRegular className="w-32 h-32 text-black" />
            </div>
          </div>
        )}

        {/* Error Alert Box */}
        {(errorMessage || localError) && (
          <div className="mt-4 bg-neo-accent border-4 border-black p-4 shadow-neo-sm flex items-center justify-between animate-bounce-subtle">
            <div className="flex items-center gap-3">
              <WarningRegular className="w-6 h-6 text-black shrink-0" />
              <p className="font-black text-sm sm:text-base text-black uppercase">
                {localError || errorMessage}
              </p>
            </div>
            <button
              onClick={() => {
                setLocalError('');
                onClearError();
              }}
              className="p-1 bg-white border-2 border-black hover:bg-black hover:text-white"
            >
              <DismissRegular className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Demo URL Presets Chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span className="font-black text-xs uppercase tracking-widest text-black/70 mr-1">
            TRY DEMO LINKS:
          </span>
          {DEMO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetClick(preset.url)}
              disabled={isLoading}
              className="group flex items-center gap-2 bg-white border-3 border-black px-3 py-1.5 shadow-neo-xs hover:bg-neo-secondary hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100 disabled:opacity-50"
            >
              {preset.platform === 'youtube' ? (
                <YoutubeIcon className="w-3.5 h-3.5 text-red-600" />
              ) : (
                <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
              )}
              <span className="font-bold text-xs uppercase">{preset.label}</span>
              <span className="bg-neo-bg border border-black px-1 text-[10px] font-black group-hover:bg-neo-accent group-hover:text-white">
                {preset.tag}
              </span>
            </button>
          ))}
        </div>
        </form>
      </div>
    </section>
  );
};
