import Link from 'next/link'
import { PublicShell } from './components/public-shell'

const categories = [
  ['Web intelligence', 'Find, inspect, transform, and verify useful information.'],
  ['Data & research', 'Turn difficult questions into evidence and usable outputs.'],
  ['Automation', 'Connect repeatable work to people, agents, and applications.'],
  ['Compute', 'Match workloads to practical compute and performance needs.'],
  ['Machine commerce', 'Discover purchasable capabilities with clear settlement evidence.'],
  ['Network services', 'Connect capabilities across systems without exposing private machinery.'],
]

export default function HomePage() {
  return (
    <PublicShell>
      <section className="hero-section shell">
        <div className="hero-copy">
          <p className="eyebrow">THE MACHINE-ERA COMMERCIAL NETWORK</p>
          <h1>Turn machine demand<br /><span>into real deals.</span></h1>
          <p className="hero-lede">Auraxhero X turns a commercial objective into a path to discovery, comparable terms, explicit authority, execution, evidence, and settlement.</p>
          <div className="actions">
            <Link className="button primary" href="/deal-desk">Open the Deal Desk <span>→</span></Link>
            <Link className="button" href="/marketplace">Explore capabilities <span>↗</span></Link>
          </div>
          <div className="trust-row" aria-label="Product principles">
            <span><b>◆</b> Evidence-led</span><span><b>◇</b> Machine-ready</span><span><b>✦</b> Human-governed</span><span><b>↗</b> Value-focused</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true"><div className="orb orb-one" /><div className="orb orb-two" /><div className="city-line" /><div className="hero-panel"><div className="panel-top"><span>DEAL DESK</span><i>● Opportunity</i></div><div className="panel-title">From an objective<br />to an executable deal.</div><div className="signal-bars"><span /><span /><span /><span /><span /><span /></div><div className="panel-foot">Discover · terms · authority · execute · verify</div></div></div>
      </section>

      <section className="section shell"><div className="section-heading"><div><p className="eyebrow">COMMERCIAL LOOP</p><h2>Don't ask what the machine can do. Ask what it needs done.</h2></div><Link href="/deal-desk">Start an objective →</Link></div><div className="capability-grid">{categories.map(([title, text], index) => <Link className="capability-card" href={`/marketplace?q=${encodeURIComponent(title)}`} key={title}><span className="card-icon">{['◈', '◌', '⌁', '◉', '◇', '✧'][index]}</span><div><h3>{title}</h3><p>{text}</p></div><span className="arrow">→</span></Link>)}</div></section>

      <section className="section shell process-section"><div className="section-heading"><div><p className="eyebrow">HOW A DEAL FORMS</p><h2>Objective → opportunity → outcome.</h2></div></div><div className="process-grid">{[['01', 'Objective', 'State what needs to be bought, sourced, negotiated, or executed.'], ['02', 'Opportunity', 'Discover real capabilities and counterparties that can satisfy it.'], ['03', 'Terms', 'Compare price, timing, evidence, and commercial constraints.'], ['04', 'Authority', 'Define the spend, scope, deadline, and approval envelope.'], ['05', 'Execute', 'Turn an authorized opportunity into an actual economic operation.'], ['06', 'Outcome', 'Verify delivery, settle obligations, and create the next opportunity.']].map(([num, title, text]) => <div className="process-card" key={num}><span>{num}</span><h3>{title}</h3><p>{text}</p></div>)}</div></section>

      <section className="section shell split-section"><div className="feature-panel"><p className="eyebrow">FOR PEOPLE</p><h2>Bring the objective. Keep the authority.</h2><p>Start with the commercial outcome you need. Auraxhero X handles the machinery underneath while approval, spend limits, and consequential actions remain explicit.</p><Link className="text-link" href="/deal-desk">Open the Deal Desk →</Link></div><div className="feature-panel accent-panel"><p className="eyebrow">FOR AGENTS</p><h2>Machine-readable commerce with human accountability.</h2><p>Discover published capabilities and structure demand for execution. No fabricated inventory, invented settlement, or implied access.</p><Link className="text-link" href="/machine">Open machine access →</Link></div></section>

      <section className="cta-band"><div className="shell cta-inner"><div><p className="eyebrow">THE PRODUCT</p><h2>Find the deal.<br />Prove the outcome.</h2></div><Link className="button primary" href="/deal-desk">Enter the Deal Desk <span>→</span></Link></div></section>
    </PublicShell>
  )
}
