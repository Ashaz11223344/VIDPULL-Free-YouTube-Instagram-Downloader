import React from 'react';
import { 
  VideoRegular, 
  MusicNote1Regular, 
  ShieldCheckmarkRegular, 
  StarRegular,
  FlashRegular,
  FireRegular,
  HeadphonesRegular,
  PhoneRegular,
  CameraRegular,
  LockClosedRegular,
  ShieldDismissRegular
} from '@fluentui/react-icons';
import { InstagramIcon } from './BrandIcons';

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-neo-muted border-3 border-black px-3 py-1 font-black text-xs uppercase tracking-widest shadow-neo-xs mb-3 -rotate-1">
            <StarRegular className="w-3.5 h-3.5" />
            <span>UNCOMPROMISING SPEED & FIDELITY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-black">
            ENGINEERED FOR <br className="hidden sm:block" />
            <span className="bg-neo-accent text-white px-3 py-0.5 border-4 border-black inline-block rotate-1 shadow-neo">
              RAW PERFORMANCE
            </span>
          </h2>
        </div>
        <p className="max-w-md font-bold text-sm sm:text-base text-black/80">
          No sign-ups, no software bloat, no artificial throttling. Direct high-speed streams from YouTube and Instagram.
        </p>
      </div>

      {/* Asymmetric Neo-Brutalist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Card 1: 4K & High Framerate (Span 7) */}
        <div className="md:col-span-7 bg-white border-4 border-black p-6 md:p-8 shadow-neo-lg neo-card flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-neo-secondary border-3 border-black px-3 py-1 font-black text-xs uppercase rotate-3 shadow-neo-xs">
            UP TO 2160p
          </div>

          <div className="space-y-4 mb-6">
            <div className="w-14 h-14 bg-neo-accent border-4 border-black flex items-center justify-center shadow-neo-sm">
              <VideoRegular className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-black">
              4K Ultra HD & 60FPS Video
            </h3>
            <p className="font-bold text-sm sm:text-base text-black/80 leading-relaxed">
              Experience maximum visual clarity. Download crystal-clear 4K, 1440p, and 1080p Full HD video tracks in both universal MP4 (H.264) and next-generation WebM formats.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t-3 border-black">
            <span className="bg-neo-bg border-2 border-black px-2.5 py-1 text-xs font-black uppercase flex items-center gap-1">
              <FlashRegular className="w-3.5 h-3.5" /> 60FPS Support
            </span>
            <span className="bg-neo-bg border-2 border-black px-2.5 py-1 text-xs font-black uppercase flex items-center gap-1">
              <VideoRegular className="w-3.5 h-3.5" /> MP4 & WebM
            </span>
            <span className="bg-neo-bg border-2 border-black px-2.5 py-1 text-xs font-black uppercase flex items-center gap-1">
              <FireRegular className="w-3.5 h-3.5" /> YouTube Shorts
            </span>
          </div>
        </div>

        {/* Card 2: 320kbps MP3 Audio (Span 5) */}
        <div className="md:col-span-5 bg-neo-secondary border-4 border-black p-6 md:p-8 shadow-neo-lg neo-card flex flex-col justify-between relative">
          <div className="space-y-4 mb-6">
            <div className="w-14 h-14 bg-white border-4 border-black flex items-center justify-center shadow-neo-sm">
              <MusicNote1Regular className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-black">
              Studio 320kbps MP3 Audio
            </h3>
            <p className="font-bold text-sm sm:text-base text-black/90 leading-relaxed">
              Extract high-bitrate MP3 music, podcasts, and soundscapes from any YouTube link with full ID3 metadata and album art.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t-3 border-black">
            <span className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black uppercase flex items-center gap-1">
              <MusicNote1Regular className="w-3.5 h-3.5" /> 320 / 256 / 192 kbps
            </span>
            <span className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black uppercase flex items-center gap-1">
              <HeadphonesRegular className="w-3.5 h-3.5" /> ID3 Tags
            </span>
          </div>
        </div>

        {/* Card 3: Instagram Reels & Carousel (Span 5) */}
        <div className="md:col-span-5 bg-neo-muted border-4 border-black p-6 md:p-8 shadow-neo-lg neo-card flex flex-col justify-between">
          <div className="space-y-4 mb-6">
            <div className="w-14 h-14 bg-white border-4 border-black flex items-center justify-center shadow-neo-sm">
              <InstagramIcon className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-black">
              Reels & Multi-Post Albums
            </h3>
            <p className="font-bold text-sm sm:text-base text-black/90 leading-relaxed">
              Grab Instagram Reels, Stories, and carousel albums. Preview each photo and video slide individually and download complete albums.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t-3 border-black">
            <span className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black uppercase flex items-center gap-1">
              <PhoneRegular className="w-3.5 h-3.5" /> HD 1080p Reels
            </span>
            <span className="bg-white border-2 border-black px-2.5 py-1 text-xs font-black uppercase flex items-center gap-1">
              <CameraRegular className="w-3.5 h-3.5" /> Carousel Slide Extract
            </span>
          </div>
        </div>

        {/* Card 4: 100% Free & Private (Span 7) */}
        <div className="md:col-span-7 bg-white border-4 border-black p-6 md:p-8 shadow-neo-lg neo-card flex flex-col justify-between">
          <div className="space-y-4 mb-6">
            <div className="w-14 h-14 bg-neo-green border-4 border-black flex items-center justify-center shadow-neo-sm">
              <ShieldCheckmarkRegular className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-black">
              Stateless, Anonymous & Safe
            </h3>
            <p className="font-bold text-sm sm:text-base text-black/80 leading-relaxed">
              Zero accounts, zero tracking, zero logs. Download history is stored exclusively in your browser’s local storage and never leaves your computer.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t-3 border-black">
            <span className="bg-neo-bg border-2 border-black px-2.5 py-1 text-xs font-black uppercase flex items-center gap-1">
              <LockClosedRegular className="w-3.5 h-3.5" /> 100% Stateless
            </span>
            <span className="bg-neo-bg border-2 border-black px-2.5 py-1 text-xs font-black uppercase flex items-center gap-1">
              <ShieldDismissRegular className="w-3.5 h-3.5" /> No Registration
            </span>
            <span className="bg-neo-bg border-2 border-black px-2.5 py-1 text-xs font-black uppercase flex items-center gap-1">
              <FlashRegular className="w-3.5 h-3.5" /> Local History Cache
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
