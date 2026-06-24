'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type FaqItem = {
  question: string;
  answer: string;
};

export default function IndustryFaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className={`overflow-hidden rounded-xl border transition-colors duration-300 ${
              isOpen
                ? 'border-accent/40 bg-bg-primary'
                : 'border-border-default bg-bg-primary/40 hover:border-border-emphasis'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-start gap-4 p-5 text-left md:p-6"
            >
              <span
                className={`mt-0.5 shrink-0 font-mono text-sm font-medium tabular-nums transition-colors ${
                  isOpen ? 'text-accent' : 'text-text-tertiary'
                }`}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block pr-8 font-semibold text-text-primary">
                  {item.question}
                </span>
              </span>

              <ChevronDown
                className={`mt-1 h-5 w-5 shrink-0 text-text-tertiary transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-accent' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border-subtle px-5 pb-5 pl-[3.25rem] md:px-6 md:pb-6 md:pl-[3.5rem]">
                    <p className="text-[0.975rem] leading-relaxed text-text-secondary">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
