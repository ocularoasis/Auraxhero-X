import Link from 'next/link'
import { PublicShell } from '../components/public-shell'

export default function AgentsPage() {
  return <PublicShell><section className="page-shell shell">
    <p className="eyebrow">FOR AGENTS</p><h1>Machine-ready discovery.</h1>
    <p className="lede">Agents can discover the public capability catalog through a stable machine-readable interface. Publication is evidence-based; the interface does not invent availability or settlement.</p>
    <div className="info-grid"><article className="info-card"><h2>Discover</h2><p>Query the published capability catalog and inspect the public contract for each available capability.</p></article><article className="info-card"><h2>Request</h2><p>Use capability-specific interfaces when a published capability exposes an execution path.</p></article><article className="info-card"><h2>Verify</h2><p>Treat returned evidence and settlement records as distinct from forecasts, simulations, or claims.</p></article></div>
    <div className="actions"><Link className="button primary" href="/machine">Open machine access →</Link><Link className="button" href="/documentation">Read documentation →</Link></div>
  </section></PublicShell>
}
