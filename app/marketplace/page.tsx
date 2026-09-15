import Link from 'next/link'
import { discoverPublicCapabilities } from '../../lib/services/capability-service'
import { PublicShell } from '../components/public-shell'

export default async function MarketplacePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  const capabilities = discoverPublicCapabilities(q)

  return <PublicShell><section className="page-shell shell">
    <p className="eyebrow">MARKETPLACE</p>
    <h1>Find useful capability.</h1>
    <p className="lede">Search the capabilities that have actually been published to the network. Auraxhero X does not turn forecasts, prototypes, or simulations into marketplace inventory.</p>
    <form className="search marketplace-search" action="/marketplace"><input name="q" defaultValue={q} placeholder="Search published capabilities" aria-label="Search published capabilities" /></form>
    {capabilities.length ? <div className="info-grid">{capabilities.map((capability) => <article className="info-card" key={capability.id}><p className="eyebrow">{capability.maturity}</p><h2>{capability.name}</h2><p>{capability.purpose}</p><small>Version {capability.version}</small></article>)}</div> : <div className="empty-state"><strong>{q ? `No published capability matched “${q}”.` : 'No published capabilities yet.'}</strong><p>The public catalog is intentionally empty until capabilities have passed the required evaluation and publication gates. Nothing here is placeholder inventory presented as live.</p></div>}
    <div className="actions"><Link className="button" href="/documentation">Read how publication works →</Link><Link className="button" href="/machine">Machine-readable discovery ↗</Link></div>
  </section></PublicShell>
}
