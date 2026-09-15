import { PublicShell } from '../components/public-shell'

export default function LoginPage() {
  return (
    <PublicShell>
      <main className="page-shell shell">
        <p className="eyebrow">SECURE ACCESS</p>
        <h1>Sign in to Auraxhero X.</h1>
        <p className="lede">Secure access is available through the production identity provider. Authorization is evaluated server-side after authentication; a URL never grants a role.</p>
        <div className="empty-state">
          <strong>Identity provider not configured yet.</strong>
          <p>No public role picker, simulated account, founder shortcut, or administrative backdoor is exposed while the production authentication adapter remains unconfigured.</p>
        </div>
      </main>
    </PublicShell>
  )
}
