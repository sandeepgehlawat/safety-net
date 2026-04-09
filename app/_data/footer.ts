export type FooterLink = { label: string; href: string; external?: boolean };
export type FooterColumn = { h: string; l: ReadonlyArray<FooterLink> };

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://safety-net-backend-production.up.railway.app";

export const FOOTER_COLUMNS: ReadonlyArray<FooterColumn> = [
  {
    h: "Product",
    l: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Positions", href: "/dashboard/positions" },
      { label: "History", href: "/dashboard/history" },
      { label: "Settings", href: "/dashboard/settings" },
    ],
  },
  {
    h: "Developers",
    l: [
      { label: "API Docs", href: "/docs" },
      { label: "GraphQL", href: `${API_URL}/graphql`, external: true },
      { label: "GitHub", href: "https://github.com/sandeepgehlawat/safety-net-backend", external: true },
    ],
  },
  {
    h: "Resources",
    l: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    h: "Legal",
    l: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];
