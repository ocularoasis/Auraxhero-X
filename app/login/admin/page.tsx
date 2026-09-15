import Link from 'next/link'
import { PublicShell } from '../../components/public-shell'

export default function AdminLoginPage() {
  return (
    <PublicShell>
      <main className="page-shell shell access-page">
        <p className="eyebrow">ADMIN ACCESS</p>
        <h1>Authorized administration.</h1>
        <p className="lede">Administrative access is granted only after server-side authentication and role authorization. Administrative capability is scoped, audited, and revocable.</p>
        <div className="empty-state">
          <strong>Authentication provider not configured in this repository.</strong>
          <p>No simulated administrator account is created here. The production identity adapter must be connected before administration is enabled.</p>
        </div>
        <Link className="text-link" href="/login">Return to secure access →</Link>
      </main>
    </PublicShell>
  )
}
