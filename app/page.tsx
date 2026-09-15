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
          <p className="eyebrow">THE MACHINE-ERA CAPABILITY NETWORK</p>
          <h1>Real capabilities.<br /><span>Real utility.</span></h1>
          <p className="hero-lede">Auraxhero X helps people, agents, applications, and organizations discover useful capabilities, connect them to real work, and move from possibility to verified value.</p>
          <div className="actions">
            <Link className="button primary" href="/marketplace">Explore capabilities <span>→</span></Link>
            <Link className="button" href="/machine">For AI agents <span>↗</span></Link>
          </div>
          <div className="trust-row" aria-label="Product principles">
            <span><b>◆</b> Evidence-led</span>
            <span><b>◇</b> Machine-ready</span>
            <span><b>✦</b> Human-governed</span>
            <span><b>↗</b> Value-focused</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="city-line" />
          <div className="hero-panel">
            <div className="panel-top"><span>CAPABILITY NETWORK</span><i>● Discoverable</i></div>
            <div className="panel-title">From a question<br />to something useful.</div>
            <div className="signal-bars"><span /><span /><span /><span /><span /><span /></div>
            <div className="panel-foot">Discovery · composition · verification</div>
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading"><div><p className="eyebrow">EXPLORE</p><h2>Capability, not complexity.</h2></div><Link href="/marketplace">View marketplace →</Link></div>
        <div className="capability-grid">
          {categories.map(([title, text], index) => <Link className="capability-card" href={`/marketplace?q=${encodeURIComponent(title)}`} key={title}>
            <span className="card-icon">{['◈', '◌', '⌁', '◉', '◇', '✧'][index]}</span>
            <div><h3>{title}</h3><p>{text}</p></div>
            <span className="arrow">→</span>
          </Link>)}
        </div>
      </section>

      <section className="section shell process-section">
        <div className="section-heading"><div><p className="eyebrow">HOW IT WORKS</p><h2>Question → capability → outcome.</h2></div></div>
        <div className="process-grid">
          {[['01', 'Discover', 'Find a useful capability or identify a missing one.'], ['02', 'Connect', 'Give the capability the context it needs to do useful work.'], ['03', 'Evaluate', 'Test the result against evidence, reliability, and constraints.'], ['04', 'Use', 'Put a verified capability into the work that needs it.'], ['05', 'Learn', 'Feed real outcomes back into future discovery and improvement.']].map(([num, title, text]) => <div className="process-card" key={num}><span>{num}</span><h3>{title}</h3><p>{text}</p></div>)}
        </div>
      </section>

      <section className="section shell split-section">
        <div className="feature-panel">
          <p className="eyebrow">FOR PEOPLE</p>
          <h2>Ask for an outcome, not a maze of software.</h2>
          <p>Start with what you need. Auraxhero X is designed to surface useful options without making you understand the machinery underneath.</p>
          <Link className="text-link" href="/marketplace">Find something useful →</Link>
        </div>
        <div className="feature-panel accent-panel">
          <p className="eyebrow">FOR AGENTS</p>
          <h2>Machine-readable discovery with human accountability.</h2>
          <p>Use the public machine interface to discover what is actually published. No fabricated inventory, no invented settlement, no implied access.</p>
          <Link className="text-link" href="/machine">Open machine access →</Link>
        </div>
      </section>

      <section className="cta-band">
        <div className="shell cta-inner">
          <div><p className="eyebrow">THE QUESTION</p><h2>What does the world need<br />that does not exist yet?</h2></div>
          <Link className="button primary" href="/about">Explore the mission <span>→</span></Link>
        </div>
      </section>
    </PublicShell>
  )
}
