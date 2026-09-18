import Link from 'next/link'
import { PublicShell } from './components/public-shell'
import './deletemefast-home.css'

const menu = [
  { title: 'Protect My Accounts', price: 'From $49', text: 'Get help securing accounts after suspicious access, credential exposure, or takeover.', icon: '🔐', href: '/services' },
  { title: 'Fight Impersonation', price: 'From $79', text: 'Organize evidence and pursue legitimate platform reporting when someone is pretending to be you.', icon: '🪪', href: '/services' },
  { title: 'Remove Harmful Content', price: 'From $99', text: 'Get a guided response for harmful posts, intimate-image abuse, AI-generated abuse, and related reporting paths.', icon: '🛡️', href: '/services' },
  { title: 'Check a Suspicious Site or App', price: 'From $39', text: 'Get a practical safety review and clear next steps before you trust, install, or send money.', icon: '🔎', href: '/services' },
  { title: 'Keep Watch', price: 'From $19/mo', text: 'Ongoing monitoring and follow-up for customers who want protection after the immediate incident.', icon: '👁️', href: '/services' },
  { title: 'Business Protection', price: 'Talk to us', text: 'Protect people, accounts, domains, and exposed information across an organization.', icon: '🏢', href: '/services' },
]

const signals = [
  ['AI impersonation', 'Identity and reputation can be abused at machine speed.'],
  ['Leaked private content', 'Fast reporting and evidence handling can matter when harmful material spreads.'],
  ['Account compromise', 'A single exposed credential can become the doorway to other accounts.'],
  ['Scams & malicious sites', 'People need understandable answers before they click, pay, or install.'],
]

export default function HomePage() {
  return (
    <PublicShell>
      <main>
        <section className="dmf-hero shell">
          <div className="dmf-hero-copy">
            <p className="eyebrow">DELETEMEFAST · ONLINE PROTECTION</p>
            <div className="dmf-wordmark" aria-label="DeleteMeFast">DeleteMe<span>Fast</span></div>
            <h1>Something online is hurting you?<br /><span>Let’s deal with it.</span></h1>
            <p className="dmf-lede">Tell us what happened. We’ll help identify the problem, organize the response, pursue legitimate reporting or removal paths, protect what we can, and keep you informed.</p>
            <div className="actions">
              <Link className="button primary" href="/report">Start private intake <span>→</span></Link>
              <Link className="button" href="/pricing">See services & prices <span>↗</span></Link>
            </div>
            <div className="dmf-proof-row"><span>Private intake</span><span>Clear pricing</span><span>Live case status</span><span>Evidence-backed work</span></div>
          </div>
          <div className="dmf-case" aria-label="DeleteMeFast case status preview">
            <div className="dmf-case-top"><span>MY CASE</span><span className="live-dot">● PRIVATE</span></div>
            <div className="case-customer"><div className="case-avatar">DMF</div><div><strong>Your private table</strong><small>Your workspace is organized around one case/ticket ID.</small></div></div>
            <div className="case-progress"><div className="progress-label"><span>Customer journey</span><b>3 questionnaires</b></div><div className="progress-line"><i /></div><div className="progress-steps"><span className="active">Soft intake</span><span>Client</span><span>Evidence</span><span>Table</span></div></div>
            <div className="case-note"><b>What happens next</b><span>We start broad, get to know the situation, verify identity, then ask exactly what information you authorize us to look for.</span></div>
          </div>
        </section>

        <section className="dmf-question shell">
          <div className="dmf-question-head">
            <div><p className="eyebrow">PRIVATE INTAKE · THREE LAYERS</p><h2>We do not ask for everything at the front door.</h2></div>
            <span className="question-count">3 stages</span>
          </div>
          <div className="dmf-menu-grid">
            <Link className="dmf-menu-card" href="/report">
              <div className="menu-visual">01</div>
              <div className="menu-card-body"><div className="menu-card-title"><h3>Soft first</h3><strong>Before profile</strong></div><p>Broad questions about why you came, urgency, and what you want help with. No intimate details required.</p><div className="included"><span>Start here</span><i>Begin →</i></div></div>
            </Link>
            <Link className="dmf-menu-card" href="/report">
              <div className="menu-visual">02</div>
              <div className="menu-card-body"><div className="menu-card-title"><h3>Understand you</h3><strong>Before your table</strong></div><p>A private conversation about what happened, who is affected, what worries you, and what outcome matters.</p><div className="included"><span>Personal context</span><i>Continue →</i></div></div>
            </Link>
            <Link className="dmf-menu-card" href="/report">
              <div className="menu-visual">03</div>
              <div className="menu-card-body"><div className="menu-card-title"><h3>Identify evidence</h3><strong>After verification</strong></div><p>Choose the names, addresses, phones, emails, usernames, domains, and other identifiers you authorize us to investigate.</p><div className="included"><span>Evidence scope</span><i>Continue →</i></div></div>
            </Link>
          </div>
        </section>

        <section className="section shell">
          <div className="section-heading"><div><p className="eyebrow">PROTECTION SERVICES</p><h2>Pick the problem. See what we can do.</h2></div><Link href="/pricing">Full pricing →</Link></div>
          <p className="dmf-menu-lede">Every service explains the outcome, what you receive, and the price. The complicated security work stays behind the scenes.</p>
          <div className="dmf-menu-grid">{menu.map((item) => <Link className="dmf-menu-card" href={item.href} key={item.title}><div className="menu-visual">{item.icon}</div><div className="menu-card-body"><div className="menu-card-title"><h3>{item.title}</h3><strong>{item.price}</strong></div><p>{item.text}</p><div className="included"><span>What you receive</span><i>View details →</i></div></div></Link>)}</div>
        </section>

        <section className="dmf-signals">
          <div className="shell"><div className="section-heading"><div><p className="eyebrow">WHAT WE’RE SEEING</p><h2>The Internet changed. Your protection has to keep up.</h2></div></div><div className="dmf-signal-grid">{signals.map(([title, text]) => <div className="dmf-signal" key={title}><span>●</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div>
        </section>

        <section className="dmf-service shell">
          <div><p className="eyebrow">YOUR CASE</p><h2>Your dashboard is your ticket.</h2><p>Once your private table is created, it stays tied to a unique case ID. Findings, authorized evidence, service recommendations, payment, ticket work, agent stamps, messages, and outcomes can all be traced to that case without exposing the machinery behind it.</p></div>
          <div className="dmf-ticket"><div><span>CASE / TICKET</span><b>DMF-YYYYMMDD-XXXXXX</b></div><ul><li><i>✓</i> Questionnaires</li><li><i>✓</i> Identity verification</li><li><i>→</i> Evidence search</li><li><i>○</i> Service authorization</li><li><i>○</i> Ticket work</li></ul></div>
        </section>

        <section className="cta-band"><div className="shell cta-inner"><div><p className="eyebrow">NEED HELP NOW?</p><h2>See what is out there.<br />Then decide what to do.</h2></div><Link className="button primary" href="/report">Start private intake <span>→</span></Link></div></section>
      </main>
    </PublicShell>
  )
}
