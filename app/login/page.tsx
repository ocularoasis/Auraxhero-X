'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, next: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('next') : null }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error ?? 'Unable to sign in.')
      router.push(data.next || '/onboarding')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.')
      setBusy(false)
    }
  }

  return (
    <main className="page-shell shell">
      <section className="feature-panel" style={{ maxWidth: 560, margin: '72px auto' }}>
        <p className="eyebrow">SECURE ACCESS</p>
        <h1>Sign in to DeleteMeFast.</h1>
        <p className="lede">Your account, payment state, onboarding state, and private case records are evaluated server-side.</p>
        <div style={{ display: 'grid', gap: 16, marginTop: 28 }}>
          <label>Email<input value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" /></label>
          <label>Password<input value={password} onChange={e => setPassword(e.target.value)} type="password" autoComplete="current-password" /></label>
          <button className="continue" disabled={busy || !email || !password} onClick={submit}>{busy ? 'Signing in…' : 'Sign in →'}</button>
          {error && <p role="alert">{error}</p>}
          <p>Need an account? <Link href="/signup">Create one</Link></p>
        </div>
      </section>
    </main>
  )
}
