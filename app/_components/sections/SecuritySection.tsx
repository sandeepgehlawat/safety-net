import { SectionHeader } from "../primitives/SectionHeader";

const TRUST: ReadonlyArray<{ k: string; v: string }> = [
  { k: "Audited by", v: "Spearbit · Trail of Bits" },
  { k: "Bug bounty", v: "$250k via Immunefi" },
  { k: "Open source", v: "github.com/safetynet" },
  { k: "Signer scope", v: "Repay & rebalance only" },
];

export function SecuritySection() {
  return (
    <section id="security" className="bg-fog border-y border-line">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-24 grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-5">
          <SectionHeader
            n="02"
            eyebrow="Trust"
            title={
              <>
                Custody you keep.
                <br />
                <span className="font-serif italic">Power you grant.</span>
              </>
            }
          />
          <p className="mt-6 text-[15px] text-mute max-w-md leading-relaxed">
            Safety Net never holds your funds. You delegate a scoped guardian signer with explicit
            allowances — and you can revoke it from the dashboard at any time, in a single tx.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-4">
          {TRUST.map((t) => (
            <div key={t.k} className="card p-5">
              <div className="label">{t.k}</div>
              <div className="mt-2 text-[16px] font-medium tracking-tight">{t.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
