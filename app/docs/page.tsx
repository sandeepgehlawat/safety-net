import Nav from "../_components/Nav";
import { Footer } from "../_components/sections/Footer";

const API_URL = "https://safety-net-backend-production.up.railway.app";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <main className="max-w-[1000px] mx-auto px-4 md:px-8 py-20">
        <h1 className="text-3xl font-semibold mb-4">API Documentation</h1>
        <p className="text-mute mb-8">
          Safety Net provides a GraphQL API for integrating liquidation protection into your DeFi applications.
        </p>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <a
            href={`${API_URL}/graphql`}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 border border-line rounded-xl hover:border-accent transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">GraphQL Playground</h2>
            <p className="text-mute text-sm">
              Interactive API explorer. Test queries and mutations in real-time.
            </p>
          </a>

          <a
            href="https://github.com/sandeepgehlawat/safety-net-backend"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 border border-line rounded-xl hover:border-accent transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">GitHub Repository</h2>
            <p className="text-mute text-sm">
              View source code, report issues, and contribute.
            </p>
          </a>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>

          <div className="bg-ink/5 rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-2">Base URL</h3>
            <code className="text-sm bg-ink/10 px-2 py-1 rounded">{API_URL}</code>
          </div>

          <div className="bg-ink/5 rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-2">GraphQL Endpoint</h3>
            <code className="text-sm bg-ink/10 px-2 py-1 rounded">{API_URL}/graphql</code>
          </div>

          <div className="bg-ink/5 rounded-xl p-6">
            <h3 className="font-semibold mb-2">WebSocket (Real-time)</h3>
            <code className="text-sm bg-ink/10 px-2 py-1 rounded">wss://safety-net-backend-production.up.railway.app/ws</code>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
          <p className="text-mute mb-4">
            Safety Net uses wallet-based authentication (SIWE - Sign In With Ethereum).
          </p>

          <div className="bg-ink/5 rounded-xl p-6">
            <h3 className="font-semibold mb-3">1. Connect Wallet</h3>
            <pre className="text-sm overflow-x-auto bg-ink text-paper p-4 rounded-lg">
{`POST /auth/connect
Content-Type: application/json

{
  "message": "safety-net.app wants you to sign in...",
  "signature": "0x..."
}`}
            </pre>

            <h3 className="font-semibold mt-6 mb-3">2. Use Token in Requests</h3>
            <pre className="text-sm overflow-x-auto bg-ink text-paper p-4 rounded-lg">
{`POST /graphql
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "{ me { id walletAddress tier } }"
}`}
            </pre>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Example Queries</h2>

          <div className="space-y-6">
            <div className="bg-ink/5 rounded-xl p-6">
              <h3 className="font-semibold mb-3">Get Lending Positions</h3>
              <pre className="text-sm overflow-x-auto bg-ink text-paper p-4 rounded-lg">
{`query {
  lendingPositions {
    id
    protocol
    healthFactor
    collateralUsd
    debtUsd
    status
  }
}`}
              </pre>
            </div>

            <div className="bg-ink/5 rounded-xl p-6">
              <h3 className="font-semibold mb-3">Get Alerts</h3>
              <pre className="text-sm overflow-x-auto bg-ink text-paper p-4 rounded-lg">
{`query {
  alerts(limit: 10) {
    id
    alertType
    currentValue
    threshold
    status
    firedAt
  }
}`}
              </pre>
            </div>

            <div className="bg-ink/5 rounded-xl p-6">
              <h3 className="font-semibold mb-3">Add Token to Watchlist</h3>
              <pre className="text-sm overflow-x-auto bg-ink text-paper p-4 rounded-lg">
{`mutation {
  addToWatchlist(
    tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    alertThresholdPct: -20.0
  ) {
    id
    symbol
    priceUsd
  }
}`}
              </pre>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">WebSocket Events</h2>
          <p className="text-mute mb-4">
            Subscribe to real-time updates via WebSocket connection.
          </p>

          <div className="bg-ink/5 rounded-xl p-6">
            <pre className="text-sm overflow-x-auto bg-ink text-paper p-4 rounded-lg">
{`// Connect with auth token
const ws = new WebSocket(
  "wss://safety-net-backend-production.up.railway.app/ws?token=<token>"
);

// Event types:
// - PositionUpdate: Health factor changes
// - AlertFired: New alert triggered
// - TxStatus: Transaction status updates
// - TokenUpdate: Watchlist price changes
// - BlockProcessed: New block indexed`}
            </pre>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
