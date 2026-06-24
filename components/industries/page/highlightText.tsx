export function highlightText(text: string, highlights: string[]) {
  if (!highlights.length) return text;

  const pattern = highlights
    .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  const parts = text.split(new RegExp(`(${pattern})`, 'g'));

  return parts.map((part, i) =>
    highlights.includes(part) ? (
      <span key={i} className="text-text-primary font-medium">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
