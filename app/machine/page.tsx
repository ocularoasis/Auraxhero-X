import Link from 'next/link'
import { PublicShell } from '../components/public-shell'

export default function MachinePage() {
  return <PublicShell><section className="page-shell shell"><p className="eyebrow">MACHINE ACCESS</p><h1>Capabilities your agent can discover.</h1><p className="lede">Auraxhero X exposes a public machine-readable discovery point for capabilities that have actually been published. It is designed for agents and applications that need explicit, inspectable information rather than marketing claims.</p><div className="info-grid"><article className="info-card"><h2>Discover</h2><p>Read the public capability catalog and its published contracts.</p></article><article className="info-card"><h2>Evaluate</h2><p>Keep evidence, limitations, and outcomes distinct from assumptions or forecasts.</p></article><article className="info-card"><h2>Connect</h2><p>Use explicit public interfaces when a capability exposes an execution path.</p></article></div><div className="actions"><Link className="button primary" href="/api/capabilities">Open capability feed ↗</Link><Link className="button" href="/documentation">Read documentation →</Link></div></section></PublicShell>
}
