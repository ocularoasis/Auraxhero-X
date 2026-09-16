import Link from 'next/link'
import { PublicShell } from '../components/public-shell'

const stages = [
  ['01', 'Objective', 'State what needs to be bought, sourced, negotiated, or executed.'],
  ['02', 'Opportunity', 'Discover real counterparties and capabilities that can satisfy it.'],
  ['03', 'Terms', 'Compare price, timing, evidence, constraints, and commercial conditions.'],
  ['04', 'Authority', 'Set the spend, scope, deadline, and approval envelope before action.'],
  ['05', 'Execution', 'Turn the approved opportunity into an actual economic operation.'],
  ['06', 'Outcome', 'Verify delivery, record settlement, and create the next opportunity.'],
]

export default function DealDeskPage() {
  return <PublicShell>
    <section className="page-shell shell">
      <p className="eyebrow">AURAXHERO X · DEAL DESK</p>
      <h1>Turn a commercial objective into an executable deal.</h1>
      <p className="lede">Auraxhero X is building a machine-native commercial layer: discover real supply, compare terms, establish authority, execute only when authorized, and verify what actually happened.</p>

      <div className="actions">
        <Link className="button primary" href="#objective">Start a commercial objective <span>→</span></Link>
        <Link className="button" href="/marketplace">Explore published capabilities <span>↗</span></Link>
      </div>

      <div className="feature-panel" id="objective" style={{ marginTop: '2rem' }}>
        <p className="eyebrow">COMMERCIAL OBJECTIVE</p>
        <h2>What needs to be bought, sourced, negotiated, or executed?</h2>
        <form className="search" action="/marketplace">
          <input name="q" placeholder="Example: verified market research under $100" aria-label="Commercial objective" />
          <div className="actions">
            <button className="button primary" type="submit">Find opportunities →</button>
          </div>
        </form>
        <p><small>This public surface discovers published capabilities. It does not claim live purchasing, payment, or settlement until a production execution provider is configured and authorized.</small></p>
      </div>
    </section>

    <section className="section shell">
      <div className="section-heading"><div><p className="eyebrow">THE DEAL LOOP</p><h2>Every stage has a commercial job.</h2></div></div>
      <div className="process-grid">
        {stages.map(([num, title, text]) => <div className="process-card" key={num}><span>{num}</span><h3>{title}</h3><p>{text}</p></div>)}
      </div>
    </section>

    <section className="section shell split-section">
      <div className="feature-panel">
        <p className="eyebrow">FOR BUYERS & AGENTS</p>
        <h2>Bring the objective. Keep the authority.</h2>
        <p>Machines can express demand, but authorization remains explicit. Spend limits, counterparties, timing, evidence requirements, and settlement conditions belong to the economic ticket—not the model.</p>
      </div>
      <div className="feature-panel accent-panel">
        <p className="eyebrow">FOR THE NETWORK</p>
        <h2>Successful deals make the network smarter.</h2>
        <p>Observed prices, fulfillment, evidence, settlement, and repeat demand can improve future discovery without turning unverified activity into a success metric.</p>
      </div>
    </section>
  </PublicShell>
}
