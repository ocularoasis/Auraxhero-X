'use client'

import { useState } from 'react'

export default function ProfileForm({ name: initialName, email: initialEmail }: { name: string; email: string }) {
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [status, setStatus] = useState('')

  async function save() {
    setStatus('Saving…')
    const response = await fetch('/api/onboarding/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    })
    const data = await response.json().catch(() => ({}))
    setStatus(response.ok ? 'Saved.' : (data.error ?? 'Unable to save profile.'))
  }

  return (
    <div style={{ display: 'grid', gap: 16, marginTop: 28 }}>
      <label>Name<input value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></label>
      <label>Email<input value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" /></label>
      <button className="continue" onClick={save} disabled={!name.trim() || !email.trim()}>Save profile</button>
      {status && <p role="status">{status}</p>}
    </div>
  )
}
