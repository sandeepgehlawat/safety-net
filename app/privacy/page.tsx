import Nav from "../_components/Nav";
import { Footer } from "../_components/sections/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <main className="max-w-[800px] mx-auto px-4 md:px-8 py-20">
        <h1 className="text-3xl font-semibold mb-8">Privacy Policy</h1>

        <div className="prose prose-gray max-w-none space-y-6 text-mute">
          <p className="text-lg">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">1. Information We Collect</h2>
            <p>
              <strong>Wallet Address:</strong> We collect your Ethereum wallet address when you
              connect to Safety Net. This is required to monitor your DeFi positions.
            </p>
            <p>
              <strong>On-Chain Data:</strong> We index publicly available blockchain data related
              to your positions on supported protocols (Aave, Morpho, Uniswap, etc.).
            </p>
            <p>
              <strong>Contact Information:</strong> If you enable notifications, we collect your
              email address or Telegram chat ID.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">2. How We Use Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Monitor your DeFi positions for liquidation risk</li>
              <li>Send alerts when positions need attention</li>
              <li>Execute authorized transactions on your behalf</li>
              <li>Improve our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">3. Data Storage</h2>
            <p>
              Your data is stored securely on encrypted servers. We retain position history for
              analytics and service improvement. You can request deletion of your data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">4. Data Sharing</h2>
            <p>
              We do not sell your data. We may share anonymized, aggregated statistics. We may
              disclose data if required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">5. Security</h2>
            <p>
              We implement industry-standard security measures. However, no system is 100% secure.
              We are non-custodial and never have access to your private keys.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">6. Your Rights</h2>
            <p>You can:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Disconnect your wallet at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">7. Contact</h2>
            <p>
              For privacy questions, contact us at privacy@safetynet.app
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
