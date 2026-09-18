import { PublicShell } from '../components/public-shell'

export default function LoginPage() {
  return (
    <PublicShell>
      <main className="page-shell shell">
        <p className="eyebrow">SECURE ACCESS</p>
        <h1>Sign in to DeleteMeFast.</h1>
        <p className="lede">Your private workspace is protected by production authentication. Authorization is evaluated server-side after authentication; a URL or visible role label never grants access.</p>
        <div className="empty-state">
          <strong>Production identity provider is not configured in this repository yet.</strong>
          <p>No simulated account, role picker, founder shortcut, or administrative backdoor is exposed while the production authentication adapter remains unconfigured.</p>
        </div>
      </main>
    </PublicShell>
  )
}
