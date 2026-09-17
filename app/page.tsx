import Link from 'next/link'
import { PublicShell } from './components/public-shell'
import './deletemefast-home.css'

const menu = [
  { title: 'Protect My Accounts', price: 'From $49', text: 'Get help securing accounts after suspicious access, credential exposure, or takeover.', icon: '🔐', href: '/services' },
  { title: 'Fight Impersonation', price: 'From $79', text: 'Organize evidence and pursue legitimate platform reporting when someone is pretending to be you.', icon: '🪪', href: '/services' },
  { title: 'Remove Harmful Content', price: 'From $99', text: 'Get a guided response for harmful posts, intimate-image abuse, AI-generated abuse, and related reporting paths.', icon: '🛡️', href: '/services' },
  { title: 'Check a Suspicious Site or App', price: 'From $39', text: 'Get a practical safety review and clear next steps before you trust, install, or send money.', icon: '🔎', href: '/services' },
  { title: 'Keep Watch', price: 'From $19/mo', text: 'Ongoing monitoring and follow-up for customers who want protection after the immediate incident.', icon: '👁️', href: '/services' },
  { title: 'Business Protection', price: 'Talk to us', text: 'Protect people, accounts, domains, and exposed information across an organization.', icon: '🏢', href: '/business' },
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
            <p className="eyebrow">DELETEMEFAST · CYBERSECURITY SERVICE</p>
            <h1>Something online is hurting you?<br /><span>Let’s deal with it.</span></h1>
            <p className="dmf-lede">Tell us what happened. We’ll help identify the problem, organize the response, pursue legitimate reporting or removal paths, protect what we can, and keep you informed.</p>
            <div className="actions">
              <Link className="button primary" href="/report">Tell us what happened <span>→</span></Link>
              <Link className="button" href="/pricing">See the menu & prices <span>↗</span></Link>
            </div>
            <div className="dmf-proof-row"><span>Private intake</span><span>Clear pricing</span><span>Human-readable status</span><span>Evidence-backed work</span></div>
          </div>
          <div className="dmf-table" aria-label="Customer service dashboard wireframe">
            <div className="dmf-table-top"><span>YOUR TABLE</span><span className="live-dot">● SEATED</span></div>
            <div className="table-customer"><div className="table-avatar">DF</div><div><strong>Your protection order</strong><small>We’re preparing the right service for you.</small></div></div>
            <div className="table-progress"><div className="progress-label"><span>Service journey</span><b>1 of 4</b></div><div className="progress-line"><i /></div><div className="progress-steps"><span className="active">Seated</span><span>Order</span><span>Kitchen</span><span>Served</span></div></div>
            <div className="table-note"><b>What happens next</b><span>Your answers help us show only the services that fit your situation. You’ll see what you receive and what it costs before you pay.</span></div>
          </div>
        </section>

        <section className="dmf-question shell">
          <div className="dmf-question-head"><div><p className="eyebrow">THE HOST · YOUR FIRST STOP</p><h2>Start with what happened — not cybersecurity jargon.</h2></div><span className="question-count">1 / 5</span></div>
          <div className="question-card">
            <div className="question-icon">?</div>
            <div><h3>What brings you here today?</h3><p>Choose the closest match. You can explain the details after you’re seated.</p></div>
            <div className="question-options"><button>Someone is pretending to be me</button><button>Private or intimate content was shared</button><button>My account may be compromised</button><button>I found a suspicious website or app</button><button>I’m worried about an AI or deepfake</button><button>Something else happened</button></div>
          </div>
        </section>

        <section className="section shell">
          <div className="section-heading"><div><p className="eyebrow">THE MENU</p><h2>See the meal before you order.</h2></div><Link href="/pricing">Full pricing →</Link></div>
          <p className="dmf-menu-lede">Each service explains the outcome, what you receive, and the price. We keep the internal methods and security machinery behind the kitchen door.</p>
          <div className="dmf-menu-grid">{menu.map((item) => <Link className="dmf-menu-card" href={item.href} key={item.title}><div className="menu-visual">{item.icon}</div><div className="menu-card-body"><div className="menu-card-title"><h3>{item.title}</h3><strong>{item.price}</strong></div><p>{item.text}</p><div className="included"><span>What you receive</span><i>View details →</i></div></div></Link>)}</div>
        </section>

        <section className="dmf-signals">
          <div className="shell"><div className="section-heading"><div><p className="eyebrow">WHAT’S ON THE STREET</p><h2>Problems are changing. Your menu should keep up.</h2></div></div><div className="dmf-signal-grid">{signals.map(([title, text]) => <div className="dmf-signal" key={title}><span>●</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div>
        </section>

        <section className="dmf-service shell">
          <div><p className="eyebrow">AFTER YOU ORDER</p><h2>Your case gets a ticket — not a black hole.</h2><p>Once service begins, your dashboard shows what stage you’re in, what work has actually happened, and what comes next. Behind the scenes, authorized agents work against a specific ticket and service window, with timestamps and evidence tied to your case.</p></div>
          <div className="dmf-ticket"><div><span>TICKET</span><b>DMF-EXAMPLE</b></div><ul><li><i>✓</i> Customer seated</li><li><i>✓</i> Service selected</li><li><i>→</i> Evidence / action underway</li><li><i>○</i> Follow-up</li><li><i>○</i> Outcome</li></ul></div>
        </section>

        <section className="cta-band"><div className="shell cta-inner"><div><p className="eyebrow">READY?</p><h2>Pull up a chair.<br />Tell us what happened.</h2></div><Link className="button primary" href="/report">Start with the Host <span>→</span></Link></div></section>
      </main>
    </PublicShell>
  )
}
