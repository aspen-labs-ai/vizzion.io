'use client';

import { useMemo, useState } from 'react';

interface CopySnippetProps {
  embedKey: string;
  siteUrl: string;
  isLocked?: boolean;
  lockReason?: string;
}

function buildSnippet(embedKey: string, siteUrl: string): string {
  return `<div id="vizzion-widget"></div>\n<script async src="${siteUrl}/widget.js"></script>\n<script>\n  window.VizzionWidget?.init({\n    embedKey: '${embedKey}',\n    target: '#vizzion-widget'\n  });\n</script>`;
}

export default function CopySnippet({
  embedKey,
  siteUrl,
  isLocked = false,
  lockReason = '',
}: CopySnippetProps) {
  const [copied, setCopied] = useState(false);

  const snippet = useMemo(() => buildSnippet(embedKey, siteUrl), [embedKey, siteUrl]);
  const displaySnippet = isLocked
    ? '// Embed code is locked until required setup is complete.'
    : snippet;

  const handleCopy = async () => {
    if (isLocked) {
      return;
    }

    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-bg-secondary">
      <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
        <p className="text-sm text-text-tertiary">Embed snippet</p>
        <button
          type="button"
          onClick={handleCopy}
          disabled={isLocked}
          className="rounded-md border border-accent/50 px-3 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLocked ? 'Locked' : copied ? 'Copied' : 'Copy Code'}
        </button>
      </div>
      {isLocked && lockReason ? (
        <p className="border-b border-border-default bg-red-500/10 px-4 py-2 text-xs text-red-200">
          {lockReason}
        </p>
      ) : null}
      <pre className="overflow-x-auto px-4 py-4 text-xs leading-5 text-text-secondary">
        <code>{displaySnippet}</code>
      </pre>
    </div>
  );
}
