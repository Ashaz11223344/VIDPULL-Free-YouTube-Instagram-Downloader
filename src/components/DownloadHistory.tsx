import React, { useState } from 'react';
import { 
  HistoryRegular, 
  DismissRegular, 
  DeleteRegular, 
  ArrowDownloadRegular, 
  CopyRegular, 
  CheckmarkRegular, 
  ClockRegular,
  SparkleRegular
} from '@fluentui/react-icons';
import type { DownloadHistoryItem } from '../types';
import { formatRelativeTime } from '../utils/formatting';

interface DownloadHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: DownloadHistoryItem[];
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
  onReFetch: (url: string) => void;
}

export const DownloadHistory: React.FC<DownloadHistoryProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onRemoveItem,
  onReFetch,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex justify-end">
      <div className="bg-neo-bg border-l-4 border-black w-full max-w-md h-full flex flex-col shadow-neo-2xl animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="bg-neo-secondary border-b-4 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HistoryRegular className="w-6 h-6 text-black" />
            <h3 className="font-black text-lg uppercase tracking-tight text-black">
              DOWNLOAD HISTORY ({history.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 bg-white border-2 border-black hover:bg-black hover:text-white"
          >
            <DismissRegular className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-white border-b-3 border-black px-4 py-2 text-xs font-bold text-black/70 flex items-center justify-between">
          <span>Saved in browser localStorage (Max 10)</span>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-red-600 hover:text-black font-black uppercase flex items-center gap-1"
            >
              <DeleteRegular className="w-3.5 h-3.5" />
              <span>CLEAR ALL</span>
            </button>
          )}
        </div>

        {/* History Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-3 border-dashed border-black/30">
              <SparkleRegular className="w-10 h-10 text-black/40 mb-2" />
              <p className="font-black text-base uppercase text-black/60">
                No recent downloads yet
              </p>
              <p className="text-xs font-bold text-black/40 mt-1">
                Your last 10 completed downloads will appear here for quick access.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-white border-3 border-black p-3 shadow-neo-xs space-y-2 hover:bg-neo-bg transition-colors"
              >
                {/* Item Header */}
                <div className="flex gap-3">
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="w-16 h-12 object-cover border-2 border-black shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-black text-xs uppercase truncate text-black">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-black/70 mt-1">
                      <span className="bg-neo-secondary border border-black px-1 uppercase">
                        {item.format}
                      </span>
                      <span>{item.fileSize}</span>
                      <span className="flex items-center gap-0.5 text-black/50 ml-auto">
                        <ClockRegular className="w-3 h-3" />
                        {formatRelativeTime(item.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-1 border-t-2 border-black/10 gap-2">
                  <button
                    onClick={() => {
                      onReFetch(item.originalUrl);
                      onClose();
                    }}
                    className="flex-1 py-1 px-2 bg-neo-accent text-white border-2 border-black font-black text-xs uppercase flex items-center justify-center gap-1 hover:bg-red-500"
                  >
                    <ArrowDownloadRegular className="w-3 h-3" />
                    <span>RE-DOWNLOAD</span>
                  </button>

                  <button
                    onClick={() => handleCopy(item.id, item.originalUrl)}
                    className="p-1 bg-white border-2 border-black hover:bg-neo-secondary"
                    title="Copy original link"
                  >
                    {copiedId === item.id ? (
                      <CheckmarkRegular className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <CopyRegular className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 bg-white border-2 border-black text-red-600 hover:bg-red-100"
                    title="Remove from history"
                  >
                    <DeleteRegular className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="bg-white border-t-4 border-black p-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-black text-white font-black text-sm uppercase border-3 border-black hover:bg-neo-accent"
          >
            CLOSE HISTORY
          </button>
        </div>

      </div>
    </div>
  );
};
