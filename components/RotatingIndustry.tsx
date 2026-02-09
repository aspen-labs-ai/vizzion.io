'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const phrases = [
  'solar panels look like on my roof',
  'a pool look like in my backyard',
  'new siding look like on my home',
  'a wrap look like on my car',
  'new flooring look like in my room',
];

export default function RotatingIndustry() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderQuestion = (phrase: string) => (
    <>
      {'\u201C'}What would{' '}
      <span className="text-accent">{phrase}</span>
      ?{'\u201D'}
    </>
  );

  return (
    <p className="text-2xl md:text-3xl italic font-medium text-text-primary grid">
      {/* Invisible sizers — all phrases rendered to reserve max height */}
      {phrases.map((phrase, i) => (
        <span
          key={`sizer-${i}`}
          className="col-start-1 row-start-1 invisible"
          aria-hidden="true"
        >
          {renderQuestion(phrase)}
        </span>
      ))}
      {/* Animated visible phrase */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="col-start-1 row-start-1"
        >
          {renderQuestion(phrases[index])}
        </motion.span>
      </AnimatePresence>
    </p>
  );
}
