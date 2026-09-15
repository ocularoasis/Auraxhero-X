export default function FounderPage() {
  return (
    <main className="shell narrow">
      <p className="eyebrow">FOUNDER CONTROL PLANE</p>
      <h1>Private system territory.</h1>
      <p className="lede">Authentication and authorization are not configured in this bootstrap. This page intentionally does not simulate a login or expose private state.</p>
      <div className="card"><strong>Boundary</strong><p>Production implementation must validate identity server-side, enforce authorization, support MFA/passkeys, record audit events, and provide revocation/recovery.</p></div>
    </main>
  )
}
