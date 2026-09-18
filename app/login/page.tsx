import { PublicShell } from '../components/public-shell'

export default function LoginPage() {
  return (
    <PublicShell>
      <main className="page-shell shell">
        <p className="eyebrow">SECURE ACCESS</p>
        <h1>Sign in to DeleteMeFast.</h1>
        <p className="lede">
          Your account, service entitlement, personalized dashboard, and case history are controlled
          by the production identity provider. No URL, browser value, or public role selector grants access.
        </p>
        <div className="empty-state">
          <strong>Production authentication is not wired in this repository yet.</strong>
          <p>
            Until the dedicated DeleteMeFast Supabase project and authentication provider are connected,
            the customer dashboard and lookup services remain fail-closed. This prevents a prototype from
            masquerading as a live account system.
          </p>
        </div>
      </main>
    </PublicShell>
  )
}
