import Link from 'next/link'
import { PublicShell } from '../../components/public-shell'

export default function StaffLoginPage() {
  return (
    <PublicShell>
      <main className="page-shell shell access-page">
        <p className="eyebrow">STAFF ACCESS</p>
        <h1>Authorized staff entry.</h1>
        <p className="lede">Staff access is deliberately narrower than administration. Server-side policy determines exactly which operational resources an authenticated staff member may use.</p>
        <div className="empty-state">
          <strong>Authentication provider not configured in this repository.</strong>
          <p>No simulated staff identity is created. Connect the production identity adapter and provision staff through the authorization system.</p>
        </div>
        <Link className="text-link" href="/login">Return to secure access →</Link>
      </main>
    </PublicShell>
  )
}
