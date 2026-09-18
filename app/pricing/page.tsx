import Link from 'next/link'
import { PROTECTION_PROCESSING_FEE_LABEL } from '../../lib/economics/protection-fee'

const services = [
  ['Suspicious site or app assessment', '$149'],
  ['Account compromise response', '$299'],
  ['Impersonation response', '$399'],
  ['AI / deepfake response', '$499'],
  ['Multi-platform response', '$999'],
  ['Ongoing protection', '$99/mo'],
]

export default function PricingPage() {
  return <main className="pricing-page" style={{maxWidth: 900, margin: '0 auto', padding: '64px 24px'}}>
    <p>DELETEMEFAST · PRICING</p>
    <h1>Clear pricing. Real work. No mystery charges.</h1>
    <p>Every billable service includes a $2.50 {PROTECTION_PROCESSING_FEE_LABEL.toLowerCase()} to support case processing, protection infrastructure, and service operations.</p>
    <div style={{display:'grid', gap:16, marginTop:32}}>
      {services.map(([name, price]) => <section key={name} style={{border:'1px solid currentColor', borderRadius:16, padding:24}}><h2>{name}</h2><strong>{price}</strong><p>Starting price before the $2.50 Protection & Processing Fee. Final scope is confirmed before payment.</p><Link href="/report">Start a request →</Link></section>)}
    </div>
    <p style={{marginTop:32}}>Free safety guidance and official reporting resources remain available without this fee. A fee applies when an interaction becomes a billable service event.</p>
  </main>
}
