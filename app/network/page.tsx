import Link from 'next/link'
import { PublicShell } from '../components/public-shell'

export default function NetworkPage() {
  return <PublicShell><section className="page-shell shell"><p className="eyebrow">NETWORK</p><h1>Connect useful things.</h1><p className="lede">Auraxhero X is designed as a capability network: people, agents, applications, services, and organizations can discover and connect useful work without requiring everyone to understand the underlying machinery.</p><div className="info-grid"><article className="info-card"><h2>People</h2><p>Start from an outcome, question, or need and discover practical ways forward.</p></article><article className="info-card"><h2>Agents</h2><p>Discover machine-readable capability contracts and use explicit interfaces.</p></article><article className="info-card"><h2>Providers</h2><p>Publish useful capabilities with evidence, clear limits, and accountable operation.</p></article></div><div className="actions"><Link className="button primary" href="/marketplace">Explore the network →</Link></div></section></PublicShell>
}
