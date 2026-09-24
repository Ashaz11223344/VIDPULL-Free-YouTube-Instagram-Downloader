import React, { useEffect } from 'react';
import { 
  ArrowDownloadRegular, 
  DismissRegular, 
  CheckmarkCircleRegular, 
  WarningRegular, 
  SparkleRegular, 
  DocumentTextRegular, 
  ClockRegular, 
  ArrowResetRegular
} from '@fluentui/react-icons';
import confetti from 'canvas-confetti';
import type { DownloadProgressState, MediaFormat, VideoMetadata } from '../types';
import { formatBytes } from '../utils/formatting';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  onRedownload: () => void;
  state: DownloadProgressState;
  metadata: VideoMetadata | null;
  format: MediaFormat | null;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  onCancel,
  onRedownload,
  state,
  metadata,
  format,
}) => {
  useEffect(() => {
    if (state.status === 'completed') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF6B6B', '#FFD93D', '#C4B5FD', '#000000'],
        });
      } catch (err) {
        console.log('Confetti effect:', err);
      }
    }
  }, [state.status]);

  if (!isOpen) return null;

  const isCompleted = state.status === 'completed';
  const isCancelled = state.status === 'cancelled';
  const isError = state.status === 'error';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-none flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black max-w-lg w-full shadow-neo-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Header */}
        <div className={`border-b-4 border-black p-4 flex items-center justify-between ${
          isCompleted ? 'bg-neo-green' : isError ? 'bg-neo-accent' : 'bg-neo-secondary'
        }`}>
          <div className="flex items-center gap-2">
            <span className="bg-black text-white p-1 border border-black">
              {isCompleted ? (
                <CheckmarkCircleRegular className="w-5 h-5 text-green-400" />
              ) : (
                <ArrowDownloadRegular className="w-5 h-5 text-neo-secondary" />
              )}
            </span>
            <span className="font-black text-base uppercase tracking-tight text-black">
              {isCompleted
                ? 'DOWNLOAD READY & SAVED!'
                : isError
                ? 'DOWNLOAD FAILED'
                : isCancelled
                ? 'DOWNLOAD CANCELLED'
                : 'PULLING MEDIA FILE...'}
            </span>
          </div>

          {(isCompleted || isCancelled || isError) && (
            <button
              onClick={onClose}
              className="p-1 bg-white border-2 border-black hover:bg-black hover:text-white"
            >
              <DismissRegular className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Content Body */}
        <div className="p-6 space-y-6">
          
          {/* File Meta Info Preview */}
          {metadata && format && (
            <div className="flex items-center gap-4 bg-neo-bg border-3 border-black p-3">
              <img
                src={metadata.thumbnail}
                alt=""
                className="w-16 h-12 object-cover border-2 border-black shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-black text-sm uppercase text-black truncate">
                  {metadata.title}
                </h4>
                <div className="flex items-center gap-2 text-xs font-bold text-black/70 mt-1">
                  <span className="bg-white border border-black px-1.5 py-0.2">
                    {format.quality}
                  </span>
                  <span className="font-mono">{format.sizeFormatted}</span>
                </div>
              </div>
            </div>
          )}

          {/* Progress Section */}
          {!isCompleted && !isCancelled && !isError && (
            <div className="space-y-4">
              {/* Animated Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5 text-xs font-black uppercase">
                  <span>Progress: {state.progress}%</span>
                  <span className="font-mono">{state.speed}</span>
                </div>
                <div className="w-full h-8 bg-white border-3 border-black p-0.5 overflow-hidden">
                  <div
                    className="h-full bg-neo-accent border-r-3 border-black bg-stripes-pattern transition-all duration-150"
                    style={{ width: `${state.progress}%` }}
                  />
                </div>
              </div>

              {/* Transfer Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border-2 border-black p-2.5 flex items-center gap-2">
                  <DocumentTextRegular className="w-4 h-4 text-black" />
                  <div>
                    <div className="text-[10px] font-black uppercase text-black/60">Transferred</div>
                    <div className="font-mono font-bold text-xs">
                      {formatBytes(state.downloadedBytes)} / {formatBytes(state.totalBytes)}
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-black p-2.5 flex items-center gap-2">
                  <ClockRegular className="w-4 h-4 text-black" />
                  <div>
                    <div className="text-[10px] font-black uppercase text-black/60">Est. Time Left</div>
                    <div className="font-mono font-bold text-xs">
                      {state.etaSeconds > 0 ? `${state.etaSeconds}s remaining` : 'Finalizing...'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancel Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full py-3 bg-white border-3 border-black font-black text-sm uppercase hover:bg-black hover:text-white transition-colors"
                >
                  CANCEL DOWNLOAD
                </button>
              </div>
            </div>
          )}

          {/* Completed State Display */}
          {isCompleted && (
            <div className="space-y-4 text-center">
              <div className="bg-neo-secondary border-3 border-black p-4">
                <SparkleRegular className="w-8 h-8 text-black mx-auto mb-2" />
                <p className="font-black text-base uppercase text-black">
                  File saved to your browser downloads!
                </p>
                <p className="font-mono text-xs text-black/80 mt-1 truncate">
                  {state.filename}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={onRedownload}
                  className="flex-1 py-3 bg-white border-3 border-black font-black text-sm uppercase hover:bg-neo-secondary flex items-center justify-center gap-2 shadow-neo-xs"
                >
                  <ArrowResetRegular className="w-4 h-4" />
                  <span>RE-TRIGGER</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-black text-white border-3 border-black font-black text-sm uppercase hover:bg-neo-accent shadow-neo-xs"
                >
                  CLOSE & DONE
                </button>
              </div>
            </div>
          )}

          {/* Error / Cancelled State */}
          {(isCancelled || isError) && (
            <div className="space-y-4 text-center">
              <div className="bg-neo-bg border-3 border-black p-4">
                <WarningRegular className="w-8 h-8 text-neo-accent mx-auto mb-2" />
                <p className="font-black text-base uppercase text-black">
                  {state.errorMessage || 'The download was not completed.'}
                </p>
              </div>

              <button
                type="button"
                onClick={onRedownload}
                className="w-full py-3 bg-neo-accent text-white border-3 border-black font-black text-sm uppercase hover:bg-red-500 shadow-neo-xs"
              >
                TRY AGAIN
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
