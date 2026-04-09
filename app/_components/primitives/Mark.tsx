export function Mark() {
  return (
    <div className="relative w-7 h-7 rounded-[8px] bg-ink grid place-items-center overflow-hidden">
      <svg viewBox="0 0 24 24" width="16" height="16" className="text-mint" aria-hidden="true">
        <path
          d="M12 2 L21 6 V12 C21 17 17 21 12 22 C7 21 3 17 3 12 V6 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}
