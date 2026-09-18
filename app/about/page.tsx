import Link from 'next/link'
import { PublicShell } from '../components/public-shell'

export default function AboutPage() {
  return <PublicShell><section className="page-shell shell">
    <p className="eyebrow">HOW IT WORKS</p>
    <h1>Protection that starts with what happened.</h1>
    <p className="lede">DeleteMeFast helps people organize a response to online harm. We start with a broad intake, learn what happened, verify identity before sensitive investigation, define the evidence you authorize us to examine, and keep the work tied to your private case.</p>
    <div className="info-grid">
      <article className="info-card"><h2>Tell us what happened</h2><p>A short first questionnaire establishes the situation, urgency, prior attempts, and the outcome you want.</p></article>
      <article className="info-card"><h2>Build your private workspace</h2><p>A second conversation gives us the context needed to understand the incident without demanding sensitive details before they are necessary.</p></article>
      <article className="info-card"><h2>Verify before sensitive searches</h2><p>After identity verification, you choose which identifiers you authorize us to investigate. Results and service work stay tied to your case.</p></article>
    </div>
    <div className="actions"><Link className="button primary" href="/report">Start private intake →</Link><Link className="button" href="/pricing">See services & prices →</Link></div>
  </section></PublicShell>
}
