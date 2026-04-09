"use client";

import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { mainnet } from "wagmi/chains";

// Simple config with only injected connector (MetaMask, etc.)
export const config = createConfig({
  chains: [mainnet],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
