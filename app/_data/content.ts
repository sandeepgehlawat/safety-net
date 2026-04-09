export const PROTOCOLS = [
  "AAVE",
  "UNISWAP",
  "CHAINLINK",
  "MORPHO",
  "PENDLE",
  "SPARK",
  "COMPOUND",
  "EULER",
] as const;

export const TICKER_ITEMS = [
  "✓ Saved 0xA1f...3c2 from $14,200 liquidation",
  "ETH HF rebalanced for 0x9b2...77d",
  "✓ LP range refreshed · ETH/USDC 0.05%",
  "Drawdown alert · ARB -21.4%",
  "✓ Repaid 1,240 USDC for 0x4ee...a09",
  "Block 19,482,711 · 14ms",
  "✓ Saved 0x77c...d12 from $4,820 liquidation",
  "Chainlink feed ETH/USD updated",
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    n: "01",
    t: "Connect",
    d: "Read-only by default. Add a guardian signer when you're ready to let the agent act.",
  },
  {
    n: "02",
    t: "Watch",
    d: "Every Aave loan, Uniswap range and ERC-20 indexed. Thresholds inferred or set by you.",
  },
  {
    n: "03",
    t: "Decide",
    d: "On danger, you get a push notification with a one-tap remediation already simulated.",
  },
  {
    n: "04",
    t: "Act",
    d: "Approve or let autopilot fire. Repay, withdraw, rebalance — fully on-chain.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: "Does Safety Net hold my funds?",
    a: "No. You delegate a scoped signer with explicit allowances. Funds always remain in your wallet, and you can revoke the signer at any time.",
  },
  {
    q: "How does the agent get paid?",
    a: "Per-block checks are paid with x402 stablecoin micropayments — fractions of a cent. The success fee or subscription is settled the same way.",
  },
  {
    q: "What if the agent fails to act in time?",
    a: "Each agent runs redundantly across multiple regions and uses private mempool routing on the paid plan. We publish uptime and intervention latency at status.safetynet.app.",
  },
  {
    q: "Which protocols are supported?",
    a: "Aave v3, Morpho Blue, Spark, Compound v3, Euler, Uniswap v3 LPs and any ERC-20 you hold. New protocols are added monthly.",
  },
  {
    q: "Can I use it without giving any signing permission?",
    a: "Yes — read-only mode is the default. You'll receive alerts and a one-tap link to act manually from your own wallet.",
  },
] as const;
