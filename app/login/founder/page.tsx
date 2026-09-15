import Link from 'next/link'
import { PublicShell } from '../../components/public-shell'

export default function FounderLoginPage() {
  return (
    <PublicShell>
      <main className="page-shell shell access-page">
        <p className="eyebrow">FOUNDER ACCESS</p>
        <h1>Verified founder entry.</h1>
        <p className="lede">Founder access is a privileged authorization boundary. The authentication provider must verify the human identity, then the server evaluates the founder grant and required authentication strength.</p>
        <div className="empty-state">
          <strong>Authentication provider not configured in this repository.</strong>
          <p>This entry surface is intentionally honest: no simulated login, hard-coded backdoor, or URL-based founder access is permitted. Connect the production identity adapter before enabling the control surface.</p>
        </div>
        <Link className="text-link" href="/login">Return to secure access →</Link>
      </main>
    </PublicShell>
  )
}
