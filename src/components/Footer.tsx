import React from 'react';
import { 
  ArrowDownloadRegular, 
  ShieldRegular,
  PlayRegular,
  MusicNote1Regular,
  PhoneRegular,
  CameraRegular,
  DocumentTextRegular,
  LockClosedRegular,
  ShieldDismissRegular
} from '@fluentui/react-icons';

interface FooterProps {
  onOpenLegal: (type: 'terms' | 'privacy' | 'dmca') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="bg-neo-secondary border-t-8 border-black text-black">
      {/* Disclaimer Top Ribbon */}
      <div className="bg-black text-white py-3 px-4 text-center border-b-4 border-black">
        <p className="font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2">
          <ShieldRegular className="w-4 h-4 text-neo-secondary" />
          <span>LEGAL DISCLAIMER: FOR PERSONAL USE ONLY. RESPECT CREATORS & COPYRIGHT LAWS.</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Brand Info (Col 5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-neo-accent p-1.5 border-3 border-black">
                <ArrowDownloadRegular className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-3xl tracking-tighter uppercase text-black">
                VIDPULL
              </span>
            </div>

            <p className="font-bold text-sm text-black/80 max-w-sm leading-relaxed">
              The fastest YouTube & Instagram video/audio downloader. No registration, no ads, completely anonymous.
            </p>
          </div>

          {/* Quick Links (Col 3) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-black text-base uppercase tracking-wider text-black border-b-3 border-black pb-1 inline-block">
              PLATFORMS
            </h4>
            <ul className="space-y-2 text-sm font-black uppercase">
              <li>
                <a href="#" className="hover:underline hover:text-red-700 flex items-center gap-2">
                  <PlayRegular className="w-4 h-4 text-red-600 shrink-0" />
                  <span>YouTube 4K Video</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-red-700 flex items-center gap-2">
                  <MusicNote1Regular className="w-4 h-4 text-red-600 shrink-0" />
                  <span>YouTube to 320k MP3</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-pink-700 flex items-center gap-2">
                  <PhoneRegular className="w-4 h-4 text-pink-600 shrink-0" />
                  <span>Instagram HD Reels</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline hover:text-pink-700 flex items-center gap-2">
                  <CameraRegular className="w-4 h-4 text-pink-600 shrink-0" />
                  <span>Instagram Carousels</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links (Col 4) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-black text-base uppercase tracking-wider text-black border-b-3 border-black pb-1 inline-block">
              LEGAL & PRIVACY
            </h4>
            <div className="flex flex-col gap-2 text-sm font-black uppercase">
              <button
                onClick={() => onOpenLegal('terms')}
                className="text-left hover:underline flex items-center gap-2"
              >
                <DocumentTextRegular className="w-4 h-4 shrink-0" />
                <span>Terms of Service</span>
              </button>
              <button
                onClick={() => onOpenLegal('privacy')}
                className="text-left hover:underline flex items-center gap-2"
              >
                <LockClosedRegular className="w-4 h-4 shrink-0" />
                <span>Privacy Policy (Zero-Data)</span>
              </button>
              <button
                onClick={() => onOpenLegal('dmca')}
                className="text-left hover:underline flex items-center gap-2"
              >
                <ShieldDismissRegular className="w-4 h-4 shrink-0" />
                <span>DMCA & Copyright Policy</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t-4 border-black flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-black uppercase">
          <p>© {new Date().getFullYear()} VIDPULL. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-1">
            <span>DESIGNED BY</span>
            <a
              href="https://ashazapps.qzz.io"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neo-accent text-white px-1.5 py-0.5 border border-black hover:bg-black hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              ASHAZ PATHAN
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
