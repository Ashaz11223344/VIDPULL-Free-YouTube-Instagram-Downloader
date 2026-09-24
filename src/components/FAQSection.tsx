import React, { useState } from 'react';
import { ChevronDownRegular, QuestionCircleRegular } from '@fluentui/react-icons';
import { FAQS } from '../utils/constants';

export const FAQSection: React.FC = () => {
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);

  const toggleIndex = (index: number) => {
    setOpenIndices(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <section id="faq" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Section Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 bg-neo-secondary border-3 border-black px-3 py-1 font-black text-xs uppercase tracking-widest shadow-neo-xs mb-3 rotate-1">
          <QuestionCircleRegular className="w-4 h-4" />
          <span>EVERYTHING YOU NEED TO KNOW</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-black">
          FREQUENTLY ASKED <br />
          <span className="bg-neo-muted px-4 py-0.5 border-4 border-black inline-block -rotate-1 shadow-neo">
            QUESTIONS
          </span>
        </h2>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {FAQS.map((faq, index) => {
          const isOpen = openIndices.includes(index);
          return (
            <div
              key={index}
              className="bg-white border-4 border-black shadow-neo-md overflow-hidden transition-all duration-150"
            >
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                className={`w-full p-4 sm:p-5 flex items-center justify-between text-left font-black text-base sm:text-lg uppercase tracking-tight transition-colors select-none ${
                  isOpen ? 'bg-neo-secondary border-b-4 border-black' : 'hover:bg-neo-bg'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="bg-black text-white px-2 py-0.5 text-xs font-mono">
                    0{index + 1}
                  </span>
                  <span>{faq.question}</span>
                </span>
                <ChevronDownRegular
                  className={`w-6 h-6 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-black' : 'text-black'
                  }`}
                />
              </button>

              {isOpen && (
                <div className="p-4 sm:p-6 bg-neo-bg/60 text-sm sm:text-base font-bold text-black/90 leading-relaxed border-t-0">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
