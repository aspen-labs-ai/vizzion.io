import Link from 'next/link';

export default function ThanksPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-bg-primary">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="animate-success-fade-in space-y-4">
          <svg
            className="w-20 h-20 mx-auto animate-checkmark-draw"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark-circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
            />
            <path
              className="checkmark-check"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="3"
              strokeLinecap="round"
              d="M14 27l7 7 16-16"
            />
          </svg>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
            Thanks! We&apos;ll be in touch soon.
          </h1>
          <p className="text-xl text-text-secondary">
            Check your email for next steps.
          </p>
        </div>

        <div className="pt-8">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-accent hover:bg-accent-hover text-primary text-lg font-semibold rounded-lg transition-all duration-250 hover:shadow-accent-glow hover:-translate-y-0.5"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
