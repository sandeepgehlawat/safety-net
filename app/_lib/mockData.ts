// Mock data for development when backend is not available

export const MOCK_LENDING_POSITIONS = [
  {
    id: "pos-1",
    protocol: "aave_v3",
    chain: "ethereum",
    healthFactor: 1.42,
    collateralUsd: 45200,
    debtUsd: 28500,
    alertThreshold: 1.5,
    indexedAt: new Date().toISOString(),
  },
  {
    id: "pos-2",
    protocol: "morpho",
    chain: "ethereum",
    healthFactor: 2.15,
    collateralUsd: 18750,
    debtUsd: 8200,
    alertThreshold: 1.5,
    indexedAt: new Date().toISOString(),
  },
  {
    id: "pos-3",
    protocol: "spark",
    chain: "ethereum",
    healthFactor: 1.88,
    collateralUsd: 72000,
    debtUsd: 35000,
    alertThreshold: 1.5,
    indexedAt: new Date().toISOString(),
  },
];

export const MOCK_LP_POSITIONS = [
  {
    id: "lp-1",
    tokenId: "456789",
    token0: { symbol: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
    token1: { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
    feeTier: 3000,
    lowerPriceUsd: 2800,
    upperPriceUsd: 3600,
    currentPriceUsd: 3245,
    inRange: true,
  },
  {
    id: "lp-2",
    tokenId: "789012",
    token0: { symbol: "WBTC", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" },
    token1: { symbol: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
    feeTier: 500,
    lowerPriceUsd: 18,
    upperPriceUsd: 22,
    currentPriceUsd: 19.5,
    inRange: true,
  },
  {
    id: "lp-3",
    tokenId: "345678",
    token0: { symbol: "ARB", address: "0x912CE59144191C1204E64559FE8253a0e49E6548" },
    token1: { symbol: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
    feeTier: 3000,
    lowerPriceUsd: 0.0003,
    upperPriceUsd: 0.0005,
    currentPriceUsd: 0.00058,
    inRange: false,
  },
];

export const MOCK_ALERTS = [
  {
    id: "alert-1",
    alertType: "health_factor",
    currentValue: 1.42,
    previousValue: 1.68,
    threshold: 1.5,
    firedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
    suggestedAction: "repay",
    simulation: {
      id: "sim-1",
      action: "repay",
      amountUsd: 2500,
      healthFactorBefore: 1.42,
      healthFactorAfter: 2.1,
      gasEstimate: 180000,
      gasCostUsd: 4.25,
    },
  },
];

export const MOCK_WATCHLIST = [
  {
    id: "watch-1",
    tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    symbol: "ETH",
    priceUsd: 3245.82,
    changePct: 2.4,
    alertThresholdPct: -20,
    status: "ok",
  },
  {
    id: "watch-2",
    tokenAddress: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    symbol: "WBTC",
    priceUsd: 63420.0,
    changePct: -1.2,
    alertThresholdPct: -20,
    status: "ok",
  },
  {
    id: "watch-3",
    tokenAddress: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    symbol: "ARB",
    priceUsd: 1.12,
    changePct: -8.5,
    alertThresholdPct: -20,
    status: "warn",
  },
  {
    id: "watch-4",
    tokenAddress: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
    symbol: "LDO",
    priceUsd: 2.34,
    changePct: 5.2,
    alertThresholdPct: -20,
    status: "ok",
  },
];

// Mock stats for StatsBar
export const MOCK_STATS = {
  blockNumber: 19_847_523,
  latencyMs: 12,
  positionsChecked: 847,
};

// Mock transactions for history page
export const MOCK_TRANSACTIONS = [
  {
    id: "tx-1",
    txType: "repay",
    status: "confirmed",
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    amountUsd: 2500,
    gasCostUsd: 4.25,
    isAutopilot: true,
    chain: "ethereum",
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    confirmedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000).toISOString(),
  },
  {
    id: "tx-2",
    txType: "rebalance",
    status: "confirmed",
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    amountUsd: 8200,
    gasCostUsd: 12.50,
    isAutopilot: false,
    chain: "ethereum",
    submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    confirmedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 45000).toISOString(),
  },
  {
    id: "tx-3",
    txType: "repay",
    status: "confirmed",
    txHash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
    amountUsd: 1800,
    gasCostUsd: 3.80,
    isAutopilot: true,
    chain: "arbitrum",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    confirmedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 15000).toISOString(),
  },
  {
    id: "tx-4",
    txType: "repay",
    status: "confirmed",
    txHash: "0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
    amountUsd: 5400,
    gasCostUsd: 8.20,
    isAutopilot: true,
    chain: "ethereum",
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    confirmedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 25000).toISOString(),
  },
  {
    id: "tx-5",
    txType: "withdraw",
    status: "confirmed",
    txHash: "0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffffgggg",
    amountUsd: 12000,
    gasCostUsd: 6.75,
    isAutopilot: false,
    chain: "ethereum",
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    confirmedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 35000).toISOString(),
  },
  {
    id: "tx-6",
    txType: "rebalance",
    status: "confirmed",
    txHash: "0x0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff",
    amountUsd: 15750,
    gasCostUsd: 18.90,
    isAutopilot: true,
    chain: "ethereum",
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    confirmedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 40000).toISOString(),
  },
  {
    id: "tx-7",
    txType: "repay",
    status: "pending",
    txHash: null,
    amountUsd: 3200,
    gasCostUsd: null,
    isAutopilot: true,
    chain: "ethereum",
    submittedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    confirmedAt: null,
  },
];

// Enable/disable mock mode
export const USE_MOCK_DATA = true;
