import Link from 'next/link'
import { PublicShell } from '../components/public-shell'

const services = [
  ['NCII & AI Deepfakes', 'Guided case management for non-consensual intimate imagery and digitally altered intimate content. Connect users to legitimate platform, nonprofit, and regulatory pathways.'],
  ['Impersonation & Identity Abuse', 'Organize evidence around fake profiles, impersonation, exposed information, and identity-based abuse.'],
  ['Suspicious Websites', 'Assess domains for common security and impersonation indicators and route legitimate reports to the relevant provider.'],
  ['Apps & Digital Threats', 'Help users document suspicious applications, permissions, distribution sources, and security concerns.'],
  ['AI & Agent Safety', 'Authorized evaluation, containment, remediation, retesting, and ongoing monitoring for AI agents and automated systems.'],
  ['Business Protection', 'Recurring protection for domains, applications, brands, employees, and AI systems with case and incident operations.'],
]

export default function ServicesPage() {
  return <PublicShell><main className="page-shell shell"><p className="eyebrow">DELETEMEFAST SERVICES</p><h1>Protection, response, and remediation.</h1><p className="lede">One service network for people and organizations dealing with digital harm, suspicious infrastructure, and AI-era security problems.</p><div className="info-grid">{services.map(([title, text]) => <article className="info-card access-card" key={title}><h2>{title}</h2><p>{text}</p><Link className="text-link" href={`/report?type=${encodeURIComponent(title)}`}>Start here →</Link></article>)}</div><section id="privacy" className="feature-panel" style={{marginTop: 24}}><p className="eyebrow">PRIVACY PRINCIPLE</p><h2>Minimize sensitive material.</h2><p>DeleteMeFast should not become a repository for harmful intimate content. Where a legitimate downstream service supports privacy-preserving hashes or fingerprints, the product should prefer those mechanisms and retain only information necessary for the case and authorized reporting workflow.</p></section></main></PublicShell>
}
