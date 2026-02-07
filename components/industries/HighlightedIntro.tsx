"use client"

import { Highlighter } from '@/components/ui/Highlighter';

interface HighlightedIntroProps {
  text: string;
  highlight?: string;
}

export function HighlightedIntro({ text, highlight }: HighlightedIntroProps) {
  if (!highlight) {
    return <p>{text}</p>;
  }

  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

  return (
    <p>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Highlighter
            key={i}
            action="highlight"
            color="rgba(16, 185, 129, 0.15)"
            strokeWidth={1.5}
            animationDuration={1000}
            iterations={1}
            padding={4}
            isView={true}
          >
            <span className="text-text-primary font-medium">{part}</span>
          </Highlighter>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}
