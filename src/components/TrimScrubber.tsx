import React from 'react';
import { formatDuration } from '../utils/formatting';

interface TrimScrubberProps {
  duration: number; // total duration in seconds
  startSec: number; // start time in seconds
  endSec: number; // end time in seconds
  onChange: (startSec: number, endSec: number) => void;
}

export const TrimScrubber: React.FC<TrimScrubberProps> = ({
  duration,
  startSec,
  endSec,
  onChange,
}) => {
  const maxDuration = Math.max(duration, 1);
  const startPercent = Math.min(100, Math.max(0, (startSec / maxDuration) * 100));
  const endPercent = Math.min(100, Math.max(0, (endSec / maxDuration) * 100));
  const selectedDuration = Math.max(0, endSec - startSec);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), endSec - 1);
    onChange(Math.max(0, val), endSec);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), startSec + 1);
    onChange(startSec, Math.min(maxDuration, val));
  };

  return (
    <div className="space-y-3 bg-white border-2 border-black p-3 shadow-neo-xs">
      <div className="flex items-center justify-between text-xs font-black uppercase">
        <span className="bg-neo-secondary border border-black px-1.5 py-0.5">
          START: {formatDuration(startSec)}
        </span>
        <span className="bg-black text-white px-1.5 py-0.5 font-mono">
          CLIP LENGTH: {formatDuration(selectedDuration)}
        </span>
        <span className="bg-neo-accent text-white border border-black px-1.5 py-0.5">
          END: {formatDuration(endSec)}
        </span>
      </div>

      {/* Visual Timeline Track */}
      <div className="relative h-7 bg-neo-bg border-2 border-black overflow-hidden select-none">
        {/* Full Track Timeline Background Lines */}
        <div className="absolute inset-0 flex justify-between items-center px-1 opacity-20 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-full w-0.5 bg-black" />
          ))}
        </div>

        {/* Selected Active Trim Zone */}
        <div
          className="absolute h-full bg-neo-accent/90 border-x-2 border-black flex items-center justify-center transition-all duration-75"
          style={{
            left: `${startPercent}%`,
            width: `${Math.max(2, endPercent - startPercent)}%`,
          }}
        >
          <span className="text-[10px] font-black text-white uppercase tracking-tighter truncate px-1 hidden sm:inline">
            {formatDuration(selectedDuration)}
          </span>
        </div>
      </div>

      {/* Dual Interactive Sliders */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-black/70 w-12">START</span>
          <input
            type="range"
            min={0}
            max={maxDuration}
            value={startSec}
            onChange={handleStartChange}
            className="w-full accent-black cursor-pointer h-2 bg-neo-bg border border-black"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-black/70 w-12">END</span>
          <input
            type="range"
            min={0}
            max={maxDuration}
            value={endSec}
            onChange={handleEndChange}
            className="w-full accent-neo-accent cursor-pointer h-2 bg-neo-bg border border-black"
          />
        </div>
      </div>
    </div>
  );
};
