export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-4xl font-black text-ink">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted">Last updated: April 26, 2026</p>
      <div className="mt-8 space-y-6 leading-7 text-muted">
        <p>ReplyPilot is a review reply drafting tool. This placeholder Privacy Policy should be reviewed by a qualified attorney before commercial launch.</p>
        <h2 className="text-2xl font-black text-ink">Information We Collect</h2>
        <p>We may collect account information, billing information through a payment processor, usage data, and review text users submit to generate draft replies.</p>
        <h2 className="text-2xl font-black text-ink">How We Use Information</h2>
        <p>We use information to provide the service, generate draft replies, manage accounts, process payments, prevent abuse, and improve product performance.</p>
        <h2 className="text-2xl font-black text-ink">Third-Party Services</h2>
        <p>Future versions may use OpenAI or another AI provider for generation, Stripe for payments, and hosting or analytics providers for operations.</p>
        <h2 className="text-2xl font-black text-ink">Data Retention</h2>
        <p>Production retention rules should be defined before launch. Users should avoid submitting sensitive personal information in reviews or prompts.</p>
        <h2 className="text-2xl font-black text-ink">Contact</h2>
        <p>For privacy questions, add your support email here before launch.</p>
      </div>
    </main>
  );
}
