import Image from 'next/image';

interface BrandLoaderProps {
  label?: string;
  /** Fill the available height (default) or render inline/compact. */
  full?: boolean;
}

export default function BrandLoader({ label = 'Loading…', full = true }: BrandLoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${full ? 'min-h-[55vh] w-full' : 'py-10'}`}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        {/* Soft glow */}
        <span className="absolute inset-0 rounded-full bg-accent/10 blur-md" aria-hidden />
        {/* Spinning accent ring */}
        <span
          className="absolute inset-0 rounded-full border-2 border-accent/20 border-t-accent"
          style={{ animation: 'vz-spin 0.8s linear infinite' }}
          aria-hidden
        />
        {/* Breathing logo */}
        <Image
          src="/vizzion-logo.png"
          alt=""
          width={30}
          height={30}
          priority
          className="h-[26px] w-auto"
          style={{ animation: 'vz-breathe 1.6s ease-in-out infinite' }}
        />
      </div>
      <p className="text-sm text-text-tertiary">{label}</p>

      <style>{`
        @keyframes vz-spin { to { transform: rotate(360deg); } }
        @keyframes vz-breathe { 0%,100% { opacity: .55; transform: scale(.94); } 50% { opacity: 1; transform: scale(1.02); } }
      `}</style>
    </div>
  );
}
