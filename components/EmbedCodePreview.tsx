'use client';

import { useEffect, useState } from 'react';

export default function EmbedCodePreview() {
  const [displayedCode, setDisplayedCode] = useState('');
  const fullCode = `<script src="https://cdn.vizzion.io/widget.js"></script>
<div data-vizzion-widget 
     data-industry="roofing"
     data-products="shingles,metal,tile">
</div>`;

  useEffect(() => {
    let currentIndex = 0;
    const typingSpeed = 30; // milliseconds per character

    const typeNextChar = () => {
      if (currentIndex < fullCode.length) {
        setDisplayedCode(fullCode.substring(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeNextChar, typingSpeed);
      } else {
        // Reset and restart after a pause
        setTimeout(() => {
          currentIndex = 0;
          setDisplayedCode('');
          setTimeout(typeNextChar, 500);
        }, 3000);
      }
    };

    // Start typing after a brief delay
    const startTimer = setTimeout(typeNextChar, 500);

    return () => {
      clearTimeout(startTimer);
    };
  }, [fullCode]);

  return (
    <div className="mt-8">
      <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        {/* Mac-style header with stoplight buttons */}
        <div className="bg-gray-800 px-3 py-2 flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
          <div className="ml-auto text-xs text-gray-400 font-mono">embed.html</div>
        </div>
        
        {/* Code content */}
        <div className="p-4 font-mono text-sm text-gray-300 h-[140px] overflow-hidden">
          <pre className="whitespace-pre-wrap break-words">
            <code>
              {displayedCode}
              <span className="inline-block w-2 h-4 bg-accent ml-0.5 animate-pulse"></span>
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
