import Link from 'next/link'
import { PublicShell } from '../components/public-shell'

export default function AboutPage() {
  return <PublicShell><section className="page-shell shell"><p className="eyebrow">AURAXHERO X</p><h1>Build what is useful.</h1><p className="lede">Auraxhero X is a machine-era capability ecosystem for discovering, verifying, composing, delivering, and economically connecting useful capabilities for humans and machines.</p><div className="info-grid"><article className="info-card"><h2>Utility first</h2><p>Optimize for real usefulness, reliability, trust, accessibility, resource efficiency, and measurable outcomes.</p></article><article className="info-card"><h2>Evidence over excitement</h2><p>Human signal is valuable evidence, not automatic truth. Forecasts and simulations remain distinct from verified outcomes.</p></article><article className="info-card"><h2>Human governance</h2><p>Authority remains explicit. Machines can operate bounded capabilities, but they do not become the source of authority.</p></article></div><div className="actions"><Link className="button primary" href="/marketplace">Explore capabilities →</Link></div></section></PublicShell>
}
