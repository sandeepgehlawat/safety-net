export type FooterLink = { label: string; href: string; external?: boolean };
export type FooterColumn = { h: string; l: ReadonlyArray<FooterLink> };

export const FOOTER_COLUMNS: ReadonlyArray<FooterColumn> = [
  {
    h: "Product",
    l: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Autopilot", href: "/autopilot" },
      { label: "Integrations", href: "/integrations" },
      { label: "Changelog", href: "/changelog" },
      { label: "Status", href: "https://status.safetynet.app", external: true },
    ],
  },
  {
    h: "Developers",
    l: [
      { label: "Docs", href: "/docs" },
      { label: "API", href: "/docs/api" },
      { label: "x402", href: "/docs/x402" },
      { label: "GitHub", href: "https://github.com/safetynet", external: true },
      { label: "Bug bounty", href: "https://immunefi.com/bounty/safetynet", external: true },
    ],
  },
  {
    h: "Company",
    l: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Brand", href: "/brand" },
    ],
  },
  {
    h: "Legal",
    l: [
      { label: "Terms", href: "/legal/terms" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Security", href: "/legal/security" },
      { label: "Disclosures", href: "/legal/disclosures" },
    ],
  },
];
