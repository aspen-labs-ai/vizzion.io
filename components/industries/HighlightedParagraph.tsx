"use client"

import { Highlighter } from '@/components/ui/Highlighter';

interface HighlightedParagraphProps {
  text: string;
  highlights: string[];
}

export function HighlightedParagraph({ text, highlights }: HighlightedParagraphProps) {
  if (!highlights.length) {
    return <p className="text-lg text-text-secondary leading-relaxed">{text}</p>;
  }

  // Build regex that matches any of the highlight phrases (case-insensitive)
  const escaped = highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(pattern);

  return (
    <p className="text-lg text-text-secondary leading-relaxed">
      {parts.map((part, i) => {
        const isHighlight = highlights.some(
          h => h.toLowerCase() === part.toLowerCase()
        );

        if (isHighlight) {
          // Alternate between underline and highlight styles for variety
          const matchIndex = highlights.findIndex(
            h => h.toLowerCase() === part.toLowerCase()
          );
          const actions: Array<"underline" | "highlight"> = ["underline", "highlight", "underline"];
          const action = actions[matchIndex % actions.length];

          return (
            <Highlighter
              key={i}
              action={action}
              color={action === "highlight" ? "rgba(16, 185, 129, 0.2)" : "#10B981"}
              strokeWidth={action === "highlight" ? 1 : 2.5}
              animationDuration={800}
              iterations={1}
              padding={action === "highlight" ? 4 : 2}
              isView={true}
            >
              <span className={action === "highlight" ? "text-text-primary" : "text-text-primary"}>
                {part}
              </span>
            </Highlighter>
          );
        }

        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}
