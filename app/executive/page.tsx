import { redirect } from 'next/navigation'
import { healthSnapshot } from '../../lib/observability'
import { executiveProfile, isExecutivePrincipal } from '../../lib/control-plane/executive'
import type { Principal } from '../../lib/control-plane/types'

// The production authentication adapter remains the authority boundary.
// This route intentionally grants nothing until that provider returns a real principal.
async function getPrincipal(): Promise<Principal> {
  return { id: 'anonymous', authenticated: false, roles: [], authStrength: 'NONE' }
}

export default async function ExecutiveCockpit() {
  const principal = await getPrincipal()
  if (!isExecutivePrincipal(principal)) redirect('/login?next=/executive')

  const health = healthSnapshot()

  return (
    <main className="page-shell shell">
      <p className="eyebrow">EXECUTIVE ACCESS</p>
      <h1>Executive Cockpit</h1>
      <p className="lede">Private executive oversight for DeleteMeFast. This view reports verified system state and administrative communications without inventing telemetry or customer data.</p>
      <div className="info-grid">
        <section className="info-card"><p className="eyebrow">EXECUTIVE PROFILE</p><h2>{executiveProfile.title}</h2><p>{executiveProfile.email}</p><p>Access: {executiveProfile.access}</p></section>
        <section className="info-card"><p className="eyebrow">SITE HEALTH</p><h2>{health.status}</h2><p>Last checked: {health.checkedAt}</p><p>{health.productionClaims ? 'Verified production telemetry connected.' : 'No verified production telemetry source connected.'}</p></section>
        <section className="info-card"><p className="eyebrow">ADMIN INBOX</p><h2>Awaiting connected feed</h2><p>Administrative notices will appear here once the production identity, event, and management-record adapters are connected.</p></section>
      </div>
      <section className="feature-panel" style={{marginTop:24}}><p className="eyebrow">OVERSIGHT</p><h2>See what the system can actually prove.</h2><p>Deployment state, authentication state, service state, security events, operational records, financial records, and administrative messages must come from their real providers before they are presented as current facts.</p></section>
    </main>
  )
}
