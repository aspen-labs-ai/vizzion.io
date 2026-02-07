"use client"

import { Highlighter } from '@/components/ui/Highlighter';

interface HighlightedHeadlineProps {
  text: string;
  highlight: string;
}

export function HighlightedHeadline({ text, highlight }: HighlightedHeadlineProps) {
  if (!highlight) return <>{text}</>;

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Highlighter
            key={i}
            action="underline"
            color="#10B981"
            strokeWidth={3}
            animationDuration={800}
            iterations={1}
            padding={4}
            isView={true}
          >
            <span className="text-accent">{part}</span>
          </Highlighter>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
