import React, { useState } from 'react';
import { 
  ArrowDownloadRegular, 
  SparkleRegular, 
  HistoryRegular, 
  NavigationRegular, 
  DismissRegular, 
  QuestionCircleRegular, 
  ShieldCheckmarkRegular 
} from '@fluentui/react-icons';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onScrollToFAQ: () => void;
  onScrollToFeatures: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  onScrollToFAQ,
  onScrollToFeatures,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-neo-bg border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="flex items-center gap-2 bg-neo-secondary border-4 border-black px-3.5 py-1.5 shadow-neo-sm neo-btn active:translate-x-[2px] active:translate-y-[2px]"
          >
            <div className="bg-neo-accent p-1 border-2 border-black">
              <ArrowDownloadRegular className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase text-black">
              VIDPULL
            </span>
          </a>

          {/* Sticker badge */}
          <div className="hidden md:flex items-center gap-1 bg-neo-accent text-white border-3 border-black px-2.5 py-0.5 text-xs font-black uppercase tracking-wider -rotate-2 shadow-neo-xs">
            <SparkleRegular className="w-3.5 h-3.5" />
            <span>100% FREE</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <button
            onClick={onScrollToFeatures}
            className="font-bold text-sm uppercase tracking-wider px-3 py-1.5 border-2 border-transparent hover:border-black hover:bg-neo-muted hover:shadow-neo-xs transition-all duration-100"
          >
            Features
          </button>
          <button
            onClick={onScrollToFAQ}
            className="font-bold text-sm uppercase tracking-wider px-3 py-1.5 border-2 border-transparent hover:border-black hover:bg-neo-secondary hover:shadow-neo-xs transition-all duration-100 flex items-center gap-1.5"
          >
            <QuestionCircleRegular className="w-4 h-4" />
            FAQ
          </button>
          
          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-2 bg-white border-4 border-black px-4 py-2 font-bold text-sm uppercase tracking-wider shadow-neo-sm neo-btn hover:bg-neo-secondary"
          >
            <HistoryRegular className="w-4 h-4" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="bg-neo-accent text-white border-2 border-black rounded-full px-1.5 py-0.2 text-xs font-black">
                {historyCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-1 bg-neo-green border-3 border-black px-2.5 py-1 text-xs font-black uppercase tracking-wider rotate-1 shadow-neo-xs">
            <ShieldCheckmarkRegular className="w-3.5 h-3.5" />
            <span>NO ADS</span>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenHistory}
            className="relative p-2 bg-white border-3 border-black shadow-neo-xs neo-btn"
            aria-label="View history"
          >
            <HistoryRegular className="w-5 h-5" />
            {historyCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-neo-accent text-white border-2 border-black rounded-full px-1 text-[10px] font-black">
                {historyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-neo-secondary border-3 border-black shadow-neo-xs neo-btn"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <DismissRegular className="w-6 h-6" />
            ) : (
              <NavigationRegular className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neo-bg border-t-4 border-black px-4 pt-4 pb-6 space-y-3 shadow-neo-lg">
          <button
            onClick={() => {
              onScrollToFeatures();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left font-black text-lg uppercase tracking-wider p-3 bg-white border-3 border-black shadow-neo-xs"
          >
            Features & Capabilities
          </button>
          <button
            onClick={() => {
              onScrollToFAQ();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left font-black text-lg uppercase tracking-wider p-3 bg-neo-secondary border-3 border-black shadow-neo-xs"
          >
            Frequently Asked Questions
          </button>
          <button
            onClick={() => {
              onOpenHistory();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between font-black text-lg uppercase tracking-wider p-3 bg-neo-muted border-3 border-black shadow-neo-xs"
          >
            <span className="flex items-center gap-2">
              <HistoryRegular className="w-5 h-5" />
              Download History
            </span>
            <span className="bg-neo-accent text-white border-2 border-black rounded-full px-2 py-0.5 text-xs font-black">
              {historyCount}
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
