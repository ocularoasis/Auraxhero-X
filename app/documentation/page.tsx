import Link from 'next/link'
import { PublicShell } from '../components/public-shell'

export default function DocumentationPage() {
  return <PublicShell><section className="page-shell shell"><p className="eyebrow">DOCUMENTATION</p><h1>Use the network with confidence.</h1><p className="lede">Public documentation explains what can be discovered, what is actually published, and how machine-readable access works. Private operational details are intentionally not part of the public experience.</p><div className="doc-list"><Link href="/machine">Machine discovery <span>↗</span></Link><Link href="/api/capabilities">Public capability feed <span>↗</span></Link><Link href="/about">Mission and principles <span>→</span></Link></div></section></PublicShell>
}
