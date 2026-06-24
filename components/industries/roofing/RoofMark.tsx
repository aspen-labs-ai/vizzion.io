export default function RoofMark({ className = '' }: { className?: string }) {
  return (
    <svg
      width="16"
      height="11"
      viewBox="0 0 16 11"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M1 10L8 2l7 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
