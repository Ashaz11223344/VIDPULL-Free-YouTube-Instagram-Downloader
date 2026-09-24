import React from 'react';
import { MARQUEE_ITEMS } from '../utils/constants';

interface MarqueeBannerProps {
  reverse?: boolean;
}

export const MarqueeBanner: React.FC<MarqueeBannerProps> = ({ reverse = false }) => {
  // Duplicate array to ensure smooth continuous loop
  const repeatedItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="w-full overflow-hidden bg-black text-white border-y-4 border-black py-3 select-none">
      <div
        className={`flex whitespace-nowrap gap-8 font-black uppercase text-sm tracking-widest ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        }`}
      >
        {repeatedItems.map((item, index) => (
          <span key={index} className="flex items-center gap-6">
            <span className={index % 2 === 0 ? 'text-neo-secondary' : 'text-neo-accent'}>
              {item}
            </span>
            <span className="text-white">★</span>
          </span>
        ))}
      </div>
    </div>
  );
};
