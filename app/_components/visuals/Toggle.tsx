export function Toggle() {
  return (
    <div className="self-start flex items-center gap-2.5">
      <div className="w-10 h-[22px] rounded-full bg-ink relative">
        <div className="absolute right-0.5 top-0.5 w-[18px] h-[18px] rounded-full bg-mint" />
      </div>
      <span className="text-[11px] text-mute font-mono uppercase tracking-wider">enabled</span>
    </div>
  );
}
