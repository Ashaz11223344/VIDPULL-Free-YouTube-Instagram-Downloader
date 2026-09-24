import React from 'react';
import { DismissRegular, ShieldDismissRegular, DocumentTextRegular, LockClosedRegular } from '@fluentui/react-icons';

interface LegalModalProps {
  type: 'terms' | 'privacy' | 'dmca' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black max-w-2xl w-full max-h-[85vh] flex flex-col shadow-neo-2xl animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-neo-secondary border-b-4 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {type === 'terms' && <DocumentTextRegular className="w-5 h-5" />}
            {type === 'privacy' && <LockClosedRegular className="w-5 h-5" />}
            {type === 'dmca' && <ShieldDismissRegular className="w-5 h-5" />}
            <h3 className="font-black text-lg uppercase tracking-tight text-black">
              {type === 'terms' && 'TERMS OF SERVICE'}
              {type === 'privacy' && 'PRIVACY POLICY'}
              {type === 'dmca' && 'DMCA & COPYRIGHT DISCLAIMER'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 bg-white border-2 border-black hover:bg-black hover:text-white"
          >
            <DismissRegular className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm font-bold text-black/80 leading-relaxed">
          {type === 'terms' && (
            <>
              <p className="bg-neo-bg border-2 border-black p-3 text-xs uppercase font-black text-black">
                LAST UPDATED: SEPTEMBER 2026 — VERSION 1.0
              </p>
              <h4 className="font-black text-black uppercase text-base">1. Acceptance of Terms</h4>
              <p>
                By using Vidpull, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our service.
              </p>
              <h4 className="font-black text-black uppercase text-base">2. Permitted Use</h4>
              <p>
                Vidpull is provided for personal, non-commercial, and offline viewing purposes only. You are solely responsible for ensuring you have the legal right or explicit permission to download and store any video, audio, or media content.
              </p>
              <h4 className="font-black text-black uppercase text-base">3. Disclaimer of Warranties</h4>
              <p>
                The service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. We do not host or store media files on our servers.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <p className="bg-neo-bg border-2 border-black p-3 text-xs uppercase font-black text-black">
                PRIVACY PROMISE: ZERO LOGS, ZERO TRACKING, 100% STATELESS
              </p>
              <h4 className="font-black text-black uppercase text-base">1. No Personal Data Collection</h4>
              <p>
                Vidpull operates on a strict zero-data-retention principle. We do not collect, store, or sell personal information, IP logs, or browsing habits.
              </p>
              <h4 className="font-black text-black uppercase text-base">2. Local Storage</h4>
              <p>
                Your download history (last 10 items) is stored exclusively in your browser’s localStorage on your personal device. You can clear this history at any time with a single click.
              </p>
            </>
          )}

          {type === 'dmca' && (
            <>
              <p className="bg-neo-accent text-white border-2 border-black p-3 text-xs uppercase font-black">
                IMPORTANT COPYRIGHT NOTICE & DMCA COMPLIANCE
              </p>
              <h4 className="font-black text-black uppercase text-base">1. Intellectual Property</h4>
              <p>
                Vidpull respects copyright laws and intellectual property owners. Vidpull does not host, store, re-broadcast, or distribute copyrighted video or audio files.
              </p>
              <h4 className="font-black text-black uppercase text-base">2. DMCA Takedown Requests</h4>
              <p>
                If you are a copyright owner and wish to request domain blocking or takedown of specific URLs, please contact us at: <span className="font-mono bg-neo-secondary px-1 border border-black text-black">dmca@vidpull.io</span>.
              </p>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-neo-bg border-t-4 border-black p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-black text-white font-black text-sm uppercase border-2 border-black hover:bg-neo-accent"
          >
            I UNDERSTAND
          </button>
        </div>

      </div>
    </div>
  );
};
