import React, { useState } from 'react';
import { 
  ArrowDownloadRegular, 
  VideoRegular, 
  MusicNote1Regular, 
  SquareMultipleRegular, 
  ClockRegular, 
  EyeRegular, 
  ThumbLikeRegular, 
  ShareRegular, 
  CopyRegular, 
  CheckmarkRegular, 
  PlayRegular,
  PersonRegular,
  CutRegular,
  DocumentTextRegular,
  CheckmarkSquareRegular,
  SquareRegular,
  ListRegular
} from '@fluentui/react-icons';
import type { VideoMetadata, MediaFormat, InstagramCarouselItem } from '../types';
import { TrimScrubber } from './TrimScrubber';
import { formatDuration } from '../utils/formatting';

function parseDurationSec(str: string, defaultVal: number): number {
  if (!str) return defaultVal;
  const parts = str.split(':').map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) return (parts[0] * 60) + parts[1];
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
  return defaultVal;
}

interface ResultCardProps {
  metadata: VideoMetadata;
  onDownload: (
    format: MediaFormat,
    trimRange?: { start: string; end: string },
    subtitleOptions?: { lang: string; format: 'srt' | 'vtt' }
  ) => void;
  onDownloadCarouselItem?: (item: InstagramCarouselItem) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  metadata,
  onDownload,
  onDownloadCarouselItem,
}) => {
  const hasAudioFormats = metadata.audioFormats && metadata.audioFormats.length > 0;
  const hasCarousel = metadata.carouselItems && metadata.carouselItems.length > 0;
  const hasSubtitles = metadata.subtitles && metadata.subtitles.length > 0;
  const hasPlaylist = metadata.isPlaylist || (metadata.playlistItems && metadata.playlistItems.length > 0);

  // Active tab: 'video' | 'audio' | 'subtitles' | 'playlist' | 'carousel'
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'subtitles' | 'playlist' | 'carousel'>(() => {
    if (metadata.isPlaylist && metadata.playlistItems && metadata.playlistItems.length > 0) {
      return 'playlist';
    }
    return 'video';
  });

  // Trimmer State
  const [isTrimActive, setIsTrimActive] = useState(false);
  const [trimStart, setTrimStart] = useState('00:00');
  const [trimEnd, setTrimEnd] = useState(() => metadata.durationFormatted || '05:00');

  // Subtitle State
  const [selectedSubLang, setSelectedSubLang] = useState<string>(() => metadata.subtitles?.[0]?.lang || 'en');
  const [subFormat, setSubFormat] = useState<'srt' | 'vtt'>('srt');

  // Playlist State
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<string[]>(() => {
    return metadata.playlistItems ? metadata.playlistItems.map(i => i.id) : [];
  });

  // Selected format
  const [selectedFormatId, setSelectedFormatId] = useState<string>(() => {
    if (activeTab === 'video') {
      const rec = metadata.formats.find(f => f.recommended);
      return rec ? rec.id : metadata.formats[0]?.id || '';
    }
    const recAudio = metadata.audioFormats?.find(f => f.recommended);
    return recAudio ? recAudio.id : metadata.audioFormats?.[0]?.id || '';
  });

  const [copied, setCopied] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Update selected format when tab switches
  const handleTabChange = (tab: 'video' | 'audio' | 'subtitles' | 'playlist' | 'carousel') => {
    setActiveTab(tab);
    if (tab === 'video') {
      const rec = metadata.formats.find(f => f.recommended) || metadata.formats[0];
      if (rec) setSelectedFormatId(rec.id);
    } else if (tab === 'audio') {
      const recAudio = metadata.audioFormats.find(f => f.recommended) || metadata.audioFormats[0];
      if (recAudio) setSelectedFormatId(recAudio.id);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(metadata.originalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: metadata.title,
          url: metadata.originalUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const currentFormatsList = activeTab === 'video' ? metadata.formats : metadata.audioFormats;
  const selectedFormat = currentFormatsList.find(f => f.id === selectedFormatId) || currentFormatsList[0];

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="bg-white border-4 border-black shadow-neo-xl">
        
        {/* Card Header Bar */}
        <div className="bg-neo-secondary border-b-4 border-black p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-black text-white border-2 border-black px-2.5 py-1 text-xs font-black uppercase tracking-wider">
              {metadata.platform.toUpperCase()} DETECTED
            </span>
            <span className="font-black text-sm uppercase tracking-wide text-black hidden sm:inline">
              READY FOR EXTRACTION
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 bg-white border-2 border-black px-3 py-1 text-xs font-bold uppercase shadow-neo-xs hover:bg-neo-bg active:translate-x-[1px] active:translate-y-[1px]"
            >
              {copied ? (
                <>
                  <CheckmarkRegular className="w-3.5 h-3.5 text-green-600" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <CopyRegular className="w-3.5 h-3.5" />
                  <span>COPY LINK</span>
                </>
              )}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 bg-white border-2 border-black px-3 py-1 text-xs font-bold uppercase shadow-neo-xs hover:bg-neo-bg active:translate-x-[1px] active:translate-y-[1px]"
            >
              <ShareRegular className="w-3.5 h-3.5" />
              <span>SHARE</span>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Media Preview & Metadata */}
            <div className="lg:col-span-5 space-y-4">
              {/* Thumbnail Container */}
              <div className="relative border-4 border-black shadow-neo overflow-hidden bg-black group">
                <img
                  src={metadata.thumbnail}
                  alt={metadata.title}
                  className="w-full h-56 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-black text-white border-2 border-white px-2 py-0.5 font-mono font-bold text-xs">
                  {metadata.durationFormatted}
                </div>

                {/* Platform Overlay Pill */}
                <div className="absolute top-3 left-3 bg-neo-accent text-white border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase tracking-wider shadow-neo-xs">
                  {metadata.platform}
                </div>

                {/* Play Preview overlay */}
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
                >
                  <div className="bg-neo-secondary border-3 border-black p-3 shadow-neo-sm">
                    <PlayRegular className="w-8 h-8 text-black" />
                  </div>
                </button>
              </div>

              {/* Title & Metadata Details */}
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-black text-black leading-tight uppercase">
                  {metadata.title}
                </h2>

                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-black/80">
                  <span className="bg-neo-muted border-2 border-black px-2 py-1 uppercase flex items-center gap-1">
                    <PersonRegular className="w-3.5 h-3.5" />
                    <span>{metadata.author}</span>
                  </span>
                  {metadata.viewsFormatted && (
                    <span className="bg-white border-2 border-black px-2 py-1 flex items-center gap-1">
                      <EyeRegular className="w-3.5 h-3.5" />
                      {metadata.viewsFormatted}
                    </span>
                  )}
                  {metadata.likesFormatted && (
                    <span className="bg-white border-2 border-black px-2 py-1 flex items-center gap-1">
                      <ThumbLikeRegular className="w-3.5 h-3.5" />
                      {metadata.likesFormatted}
                    </span>
                  )}
                  <span className="bg-white border-2 border-black px-2 py-1 flex items-center gap-1">
                    <ClockRegular className="w-3.5 h-3.5" />
                    {metadata.uploadDate}
                  </span>
                </div>

                {/* Trimmer Box */}
                <div className="bg-neo-bg border-3 border-black p-3 space-y-3 shadow-neo-xs mt-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setIsTrimActive(!isTrimActive)}
                      className="flex items-center gap-1.5 font-black text-xs uppercase text-black hover:text-neo-accent"
                    >
                      <CutRegular className="w-4 h-4 text-black" />
                      <span>VISUAL TRIMMER ({isTrimActive ? 'ENABLED' : 'DISABLED'})</span>
                    </button>
                    {isTrimActive && (
                      <button
                        type="button"
                        onClick={() => {
                          setTrimStart('00:00');
                          setTrimEnd(metadata.durationFormatted || '05:00');
                        }}
                        className="text-[10px] font-black uppercase text-red-600 hover:underline"
                      >
                        RESET
                      </button>
                    )}
                  </div>

                  {isTrimActive && (
                    <div className="space-y-3 pt-2 border-t-2 border-black/10">
                      {/* Visual Interactive Dual-Handle Timeline Scrubber */}
                      <TrimScrubber
                        duration={metadata.duration || parseDurationSec(metadata.durationFormatted, 300)}
                        startSec={parseDurationSec(trimStart, 0)}
                        endSec={parseDurationSec(trimEnd, metadata.duration || 300)}
                        onChange={(sSec, eSec) => {
                          setTrimStart(formatDuration(sSec));
                          setTrimEnd(formatDuration(eSec));
                        }}
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-black uppercase text-black/70 block mb-1">Start (MM:SS)</label>
                          <input
                            type="text"
                            value={trimStart}
                            onChange={(e) => setTrimStart(e.target.value)}
                            placeholder="00:00"
                            className="w-full bg-white border-2 border-black px-2 py-1 text-xs font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-black/70 block mb-1">End (MM:SS)</label>
                          <input
                            type="text"
                            value={trimEnd}
                            onChange={(e) => setTrimEnd(e.target.value)}
                            placeholder="02:30"
                            className="w-full bg-white border-2 border-black px-2 py-1 text-xs font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Tab Selector & Quality Grid */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Media Format Category Tabs */}
              <div className="flex border-4 border-black bg-neo-bg p-1 gap-1 flex-wrap sm:flex-nowrap">
                {hasPlaylist && (
                  <button
                    type="button"
                    onClick={() => handleTabChange('playlist')}
                    className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider transition-all duration-100 border-2 ${
                      activeTab === 'playlist'
                        ? 'bg-neo-secondary text-black border-black shadow-neo-xs'
                        : 'bg-white text-black border-transparent hover:border-black'
                    }`}
                  >
                    <ListRegular className="w-4 h-4" />
                    <span>Playlist ({metadata.playlistItems?.length})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleTabChange('video')}
                  className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider transition-all duration-100 border-2 ${
                    activeTab === 'video'
                      ? 'bg-neo-accent text-white border-black shadow-neo-xs'
                      : 'bg-white text-black border-transparent hover:border-black'
                  }`}
                >
                  <VideoRegular className="w-4 h-4" />
                  <span>Video</span>
                </button>

                {hasAudioFormats && (
                  <button
                    type="button"
                    onClick={() => handleTabChange('audio')}
                    className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider transition-all duration-100 border-2 ${
                      activeTab === 'audio'
                        ? 'bg-neo-secondary text-black border-black shadow-neo-xs'
                        : 'bg-white text-black border-transparent hover:border-black'
                    }`}
                  >
                    <MusicNote1Regular className="w-4 h-4" />
                    <span>Audio MP3</span>
                  </button>
                )}

                {hasSubtitles && (
                  <button
                    type="button"
                    onClick={() => handleTabChange('subtitles')}
                    className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider transition-all duration-100 border-2 ${
                      activeTab === 'subtitles'
                        ? 'bg-neo-green text-black border-black shadow-neo-xs'
                        : 'bg-white text-black border-transparent hover:border-black'
                    }`}
                  >
                    <DocumentTextRegular className="w-4 h-4" />
                    <span>Subtitles ({metadata.subtitles?.length})</span>
                  </button>
                )}

                {hasCarousel && (
                  <button
                    type="button"
                    onClick={() => handleTabChange('carousel')}
                    className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider transition-all duration-100 border-2 ${
                      activeTab === 'carousel'
                        ? 'bg-neo-muted text-black border-black shadow-neo-xs'
                        : 'bg-white text-black border-transparent hover:border-black'
                    }`}
                  >
                    <SquareMultipleRegular className="w-4 h-4" />
                    <span>Album ({metadata.carouselItems?.length})</span>
                  </button>
                )}
              </div>

              {/* Tab 0: Playlist Queue Batch Table */}
              {activeTab === 'playlist' && metadata.playlistItems && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-neo-bg border-3 border-black p-3 shadow-neo-xs">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedPlaylistIds.length === metadata.playlistItems?.length) {
                            setSelectedPlaylistIds([]);
                          } else {
                            setSelectedPlaylistIds(metadata.playlistItems?.map(i => i.id) || []);
                          }
                        }}
                        className="flex items-center gap-2 bg-white border-2 border-black px-3 py-1.5 font-black text-xs uppercase hover:bg-neo-secondary"
                      >
                        {selectedPlaylistIds.length === metadata.playlistItems.length ? (
                          <CheckmarkSquareRegular className="w-4 h-4 text-neo-accent" />
                        ) : (
                          <SquareRegular className="w-4 h-4 text-black" />
                        )}
                        <span>
                          {selectedPlaylistIds.length === metadata.playlistItems.length ? 'DESELECT ALL' : 'SELECT ALL'}
                        </span>
                      </button>

                      <span className="font-black text-xs uppercase text-black">
                        SELECTED: <span className="bg-black text-white px-1.5 py-0.5 font-mono">{selectedPlaylistIds.length} / {metadata.playlistItems.length}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const selectedItems = metadata.playlistItems?.filter(i => selectedPlaylistIds.includes(i.id)) || [];
                        selectedItems.forEach((item, idx) => {
                          setTimeout(() => {
                            const itemFormat: MediaFormat = {
                              id: item.id,
                              quality: '720p HD',
                              resolution: '1280x720',
                              height: 720,
                              format: 'mp4',
                              sizeFormatted: '~15.0 MB',
                              sizeBytes: 15728640,
                            };
                            onDownload({ ...itemFormat, url: item.url } as any);
                          }, idx * 1500);
                        });
                      }}
                      disabled={selectedPlaylistIds.length === 0}
                      className="bg-neo-accent text-white border-3 border-black px-4 py-2 font-black text-xs uppercase tracking-wider shadow-neo-xs hover:bg-red-500 disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <ArrowDownloadRegular className="w-4 h-4" />
                      <span>DOWNLOAD SELECTED ({selectedPlaylistIds.length})</span>
                    </button>
                  </div>

                  {/* Playlist Table list */}
                  <div className="border-3 border-black max-h-80 overflow-y-auto divide-y-2 divide-black bg-white">
                    {metadata.playlistItems.map((item) => {
                      const isChecked = selectedPlaylistIds.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          className={`p-3 flex items-center justify-between gap-3 transition-colors ${
                            isChecked ? 'bg-neo-secondary/30' : 'hover:bg-neo-bg'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedPlaylistIds(prev => prev.filter(id => id !== item.id));
                                } else {
                                  setSelectedPlaylistIds(prev => [...prev, item.id]);
                                }
                              }}
                              className="w-4 h-4 accent-black cursor-pointer shrink-0"
                            />
                            <span className="font-mono font-bold text-xs bg-black text-white px-1.5 py-0.5 shrink-0">
                              #{item.index}
                            </span>
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-12 h-9 object-cover border border-black shrink-0 hidden sm:block"
                            />
                            <div className="min-w-0">
                              <p className="font-black text-xs text-black truncate">{item.title}</p>
                              <p className="font-bold text-[10px] text-black/70 uppercase truncate">
                                {item.author} • {item.durationFormatted}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const itemFormat: MediaFormat = {
                                id: item.id,
                                quality: '720p HD',
                                resolution: '1280x720',
                                height: 720,
                                format: 'mp4',
                                sizeFormatted: '~15.0 MB',
                                sizeBytes: 15728640,
                              };
                              onDownload({ ...itemFormat, url: item.url } as any);
                            }}
                            className="bg-white border-2 border-black px-2.5 py-1 text-[10px] font-black uppercase hover:bg-neo-secondary shrink-0"
                          >
                            DOWNLOAD
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 1 & 2: Video & Audio Formats List */}
              {(activeTab === 'video' || activeTab === 'audio') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm uppercase tracking-wider text-black">
                      {activeTab === 'video' ? 'Select Video Resolution:' : 'Select Audio Bitrate:'}
                    </span>
                    <span className="font-mono text-xs font-bold text-black/70">
                      {currentFormatsList.length} options available
                    </span>
                  </div>

                  {/* Quality Radio Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                    {currentFormatsList.map((fmt) => {
                      const isSelected = selectedFormatId === fmt.id;
                      return (
                        <div
                          key={fmt.id}
                          onClick={() => setSelectedFormatId(fmt.id)}
                          className={`relative cursor-pointer p-3 border-3 border-black transition-all duration-100 select-none ${
                            isSelected
                              ? 'bg-neo-secondary shadow-neo-sm translate-x-[-2px] translate-y-[-2px]'
                              : 'bg-white hover:bg-neo-bg hover:shadow-neo-xs'
                          }`}
                        >
                          {fmt.recommended && (
                            <span className="absolute -top-2.5 right-2 bg-neo-accent text-white border border-black px-1.5 py-0.2 text-[10px] font-black uppercase tracking-widest">
                              RECOMMENDED
                            </span>
                          )}

                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="quality-selector"
                                checked={isSelected}
                                onChange={() => setSelectedFormatId(fmt.id)}
                                className="w-4 h-4 accent-black"
                              />
                              <span className="font-black text-sm uppercase text-black">
                                {fmt.quality}
                              </span>
                            </div>
                            <span className="bg-black text-white font-mono text-xs font-bold px-1.5 py-0.5">
                              {fmt.format.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs font-bold text-black/70 mt-2 pl-6">
                            <span>{fmt.resolution}</span>
                            {fmt.fps && <span>{fmt.fps} FPS</span>}
                            <span className="font-mono text-black font-black bg-white border border-black px-1">
                              ~{fmt.sizeFormatted}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Primary Download CTA Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedFormat) {
                          onDownload(
                            selectedFormat,
                            isTrimActive ? { start: trimStart, end: trimEnd } : undefined
                          );
                        }
                      }}
                      className="w-full h-16 bg-neo-accent text-white border-4 border-black font-black text-xl uppercase tracking-wider shadow-neo neo-btn hover:bg-red-500 flex items-center justify-center gap-3"
                    >
                      <ArrowDownloadRegular className="w-6 h-6" />
                      <span>
                        DOWNLOAD {selectedFormat?.quality || 'NOW'}{isTrimActive ? ` (TRIMMED: ${trimStart}-${trimEnd})` : ''}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Subtitles Tab */}
              {activeTab === 'subtitles' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm uppercase tracking-wider text-black">
                      Available Captions ({metadata.subtitles?.length}):
                    </span>
                    <div className="flex items-center gap-1 bg-white border-2 border-black p-0.5">
                      <button
                        type="button"
                        onClick={() => setSubFormat('srt')}
                        className={`px-2 py-0.5 text-xs font-black uppercase ${subFormat === 'srt' ? 'bg-neo-accent text-white' : 'text-black'}`}
                      >
                        .SRT
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubFormat('vtt')}
                        className={`px-2 py-0.5 text-xs font-black uppercase ${subFormat === 'vtt' ? 'bg-neo-accent text-white' : 'text-black'}`}
                      >
                        .VTT
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                    {metadata.subtitles?.map((sub) => {
                      const isSelected = selectedSubLang === sub.lang;
                      return (
                        <div
                          key={sub.lang}
                          onClick={() => setSelectedSubLang(sub.lang)}
                          className={`cursor-pointer p-2.5 border-3 border-black transition-all text-xs font-black uppercase flex items-center justify-between ${
                            isSelected ? 'bg-neo-secondary shadow-neo-sm translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-neo-bg'
                          }`}
                        >
                          <span className="truncate pr-2">{sub.name}</span>
                          <span className="bg-black text-white px-1.5 py-0.5 text-[10px] font-mono shrink-0">
                            {sub.lang}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const subFmt: MediaFormat = {
                        id: `sub-${selectedSubLang}`,
                        quality: `Subtitle (${selectedSubLang.toUpperCase()})`,
                        resolution: subFormat.toUpperCase(),
                        height: 0,
                        format: subFormat as any,
                        sizeFormatted: '< 100 KB',
                        sizeBytes: 50000,
                      };
                      onDownload(subFmt, undefined, { lang: selectedSubLang, format: subFormat });
                    }}
                    className="w-full h-16 bg-neo-green text-black border-4 border-black font-black text-lg uppercase tracking-wider shadow-neo neo-btn hover:bg-neo-secondary flex items-center justify-center gap-2"
                  >
                    <ArrowDownloadRegular className="w-6 h-6" />
                    <span>DOWNLOAD {selectedSubLang.toUpperCase()} SUBTITLE ({subFormat.toUpperCase()})</span>
                  </button>
                </div>
              )}

              {/* Tab 3: Instagram Carousel Items Grid */}
              {activeTab === 'carousel' && metadata.carouselItems && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm uppercase tracking-wider text-black">
                      Album Slides & Media ({metadata.carouselItems.length} items):
                    </span>
                    <button
                      type="button"
                      onClick={() => onDownload(metadata.formats[0])}
                      className="bg-black text-white border-2 border-black px-3 py-1 font-bold text-xs uppercase hover:bg-neo-accent"
                    >
                      Download All as ZIP
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-1">
                    {metadata.carouselItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="bg-white border-3 border-black p-2 shadow-neo-xs space-y-2 flex flex-col justify-between"
                      >
                        <div className="relative border-2 border-black bg-black h-32 overflow-hidden">
                          <img
                            src={item.previewUrl}
                            alt={`Slide ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-1 left-1 bg-black text-white px-1.5 py-0.5 text-[10px] font-black uppercase">
                            #{idx + 1} • {item.type.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>{item.resolution}</span>
                          <span className="font-mono">{item.sizeFormatted}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (onDownloadCarouselItem) {
                              onDownloadCarouselItem(item);
                            } else {
                              onDownload(metadata.formats[0]);
                            }
                          }}
                          className="w-full py-1.5 bg-neo-secondary border-2 border-black font-black text-xs uppercase hover:bg-neo-accent hover:text-white flex items-center justify-center gap-1.5 shadow-neo-xs"
                        >
                          <ArrowDownloadRegular className="w-3.5 h-3.5" />
                          <span>DOWNLOAD SLIDE</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black max-w-2xl w-full shadow-neo-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b-3 border-black pb-3">
              <h3 className="font-black text-lg uppercase">{metadata.title}</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="bg-neo-accent text-white border-2 border-black px-2 py-0.5 font-bold"
              >
                CLOSE
              </button>
            </div>
            <div className="aspect-video bg-black border-3 border-black flex items-center justify-center text-white">
              <img
                src={metadata.thumbnail}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-bold text-black/80">
              Ready to export in {selectedFormat?.quality || 'High Definition'}.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
