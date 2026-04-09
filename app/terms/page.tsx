import Nav from "../_components/Nav";
import { Footer } from "../_components/sections/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <main className="max-w-[800px] mx-auto px-4 md:px-8 py-20">
        <h1 className="text-3xl font-semibold mb-8">Terms of Service</h1>

        <div className="prose prose-gray max-w-none space-y-6 text-mute">
          <p className="text-lg">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Safety Net, you agree to be bound by these Terms of Service.
              If you do not agree, do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">2. Description of Service</h2>
            <p>
              Safety Net is a non-custodial DeFi monitoring and automation service. We monitor your
              on-chain positions and can execute pre-approved transactions on your behalf to help
              prevent liquidations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">3. Non-Custodial</h2>
            <p>
              Safety Net is non-custodial. We never have access to your private keys or seed phrases.
              All transactions require your explicit approval or pre-authorized guardian permissions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">4. Risks</h2>
            <p>
              DeFi involves significant risks including but not limited to: smart contract bugs,
              oracle failures, network congestion, and market volatility. Safety Net does not
              guarantee prevention of liquidations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">5. No Financial Advice</h2>
            <p>
              Safety Net does not provide financial, investment, or trading advice. You are solely
              responsible for your DeFi positions and decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">6. Limitation of Liability</h2>
            <p>
              Safety Net is provided "as is" without warranties. We are not liable for any losses
              arising from use of the service, including failed transactions or liquidations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mt-8 mb-4">7. Contact</h2>
            <p>
              For questions about these terms, contact us at legal@safetynet.app
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
