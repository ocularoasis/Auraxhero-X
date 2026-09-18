'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const slides = [
  ['WELCOME', 'This is your private DeleteMeFast workspace.', 'Everything that belongs to your case will stay organized here: your profile, authorized searches, findings, work, receipts, and next steps.'],
  ['YOUR CASE', 'Your case follows one clear record.', 'After payment is verified, your work is organized around a case record so you can see what has been requested, what has actually happened, and what still needs attention.'],
  ['YOUR INFORMATION', 'You control what we investigate.', 'Sensitive identifiers are not searched simply because you typed them into a form. Searches require the appropriate authorization and identity verification boundary.'],
  ['REAL WORK', 'No invented findings.', 'Your dashboard only presents observations, service activity, evidence, receipts, and status that the system can actually verify.'],
  ['NEXT STEP', 'Finish your profile, then answer the private questionnaire.', 'The questionnaire opens your dashboard and gives the system the information it needs to organize your case.'],
] as const

export default function OnboardingSlides({ customer }: { customer: { name: string; email: string; profileComplete: boolean; slideshowComplete: boolean } }) {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const [name, setName] = useState(customer.name)
  const [email, setEmail] = useState(customer.email)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function saveProfile() {
    const response = await fetch('/api/onboarding/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error ?? 'Unable to save profile.')
    }
  }

  async function finish() {
    setBusy(true)
    setError('')
    try {
      if (!name.trim() || !email.trim()) throw new Error('Complete your name and email before continuing.')
      await saveProfile()
      const response = await fetch('/api/onboarding/slideshow-complete', { method: 'POST' })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error ?? 'Unable to complete onboarding.')
      }
      router.push('/questionnaire')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to continue.')
      setBusy(false)
    }
  }

  const slide = slides[index]
  return (
    <section className="feature-panel" style={{ maxWidth: 860, margin: '72px auto' }}>
      <p className="eyebrow">PRIVATE ONBOARDING · {index + 1} / {slides.length}</p>
      <div style={{ minHeight: 360, display: 'grid', alignContent: 'center', gap: 20 }}>
        <span style={{ fontSize: 13, letterSpacing: '.14em', opacity: .7 }}>{slide[0]}</span>
        <h1 style={{ margin: 0, maxWidth: 720 }}>{slide[1]}</h1>
        <p className="lede" style={{ maxWidth: 700 }}>{slide[2]}</p>
        {index === 4 && (
          <div className="info-grid" style={{ marginTop: 8 }}>
            <label className="info-card"><strong>Name</strong><input value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></label>
            <label className="info-card"><strong>Email</strong><input value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" /></label>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, borderTop: '1px solid rgba(255,255,255,.12)', paddingTop: 20 }}>
        <button type="button" onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0 || busy}>Back</button>
        {index < slides.length - 1 ? (
          <button type="button" className="continue" onClick={() => setIndex(i => i + 1)} disabled={busy}>Continue →</button>
        ) : (
          <button type="button" className="continue" onClick={finish} disabled={busy || !name.trim() || !email.trim()}>
            {busy ? 'Preparing your questionnaire…' : 'Open private questionnaire →'}
          </button>
        )}
      </div>
      {error && <p role="alert" style={{ marginTop: 16 }}>{error}</p>}
      <p style={{ marginTop: 18, opacity: .65, fontSize: 13 }}>This onboarding cannot be dismissed or skipped. Complete it once to reach the private questionnaire.</p>
    </section>
  )
}
