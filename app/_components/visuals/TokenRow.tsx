type Tone = "ok" | "warn" | "bad";

const TONE_TEXT: Record<Tone, string> = {
  bad: "text-coral",
  warn: "text-amber",
  ok: "text-mint-deep",
};

type Props = { sym: string; px: string; d: string; tone: Tone };

export function TokenRow({ sym, px, d, tone }: Props) {
  return (
    <li className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-fog border border-line grid place-items-center text-[10px] font-mono">
          {sym[0]}
        </div>
        <span className="font-medium text-[13px]">{sym}</span>
      </div>
      <div className="font-mono text-[11px] text-mute tnum">{px}</div>
      <div className={`font-mono text-[11px] tnum ${TONE_TEXT[tone]}`}>{d}</div>
    </li>
  );
}
