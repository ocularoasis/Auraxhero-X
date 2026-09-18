'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const impact = ['Privacy', 'Personal safety', 'Work or reputation', 'Family', 'Financial risk', 'Account security']

export default function QuestionnairePage() {
  const router = useRouter()
  const [story, setStory] = useState('')
  const [outcome, setOutcome] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function toggle(value: string) {
    setSelected(current => current.includes(value) ? current.filter(item => item !== value) : [...current, value])
  }

  async function submit() {
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/onboarding/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story, outcome, impact: selected }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error ?? 'Unable to complete questionnaire.')
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to continue.')
      setBusy(false)
    }
  }

  return (
    <main className="page-shell shell">
      <section className="feature-panel" style={{ maxWidth: 900, margin: '56px auto' }}>
        <p className="eyebrow">PRIVATE QUESTIONNAIRE · YOUR CASE</p>
        <h1>Tell us what is happening so your dashboard can be built around your situation.</h1>
        <p className="lede">This is the private intake after payment and onboarding. Keep evidence out of this first response unless the service specifically asks for it.</p>

        <label className="field" style={{ display: 'grid', gap: 8, marginTop: 28 }}>
          <span>What happened, in your own words?</span>
          <textarea value={story} onChange={e => setStory(e.target.value)} rows={7} />
        </label>

        <fieldset style={{ marginTop: 28 }}>
          <legend>What is affected?</legend>
          <div className="info-grid">
            {impact.map(item => <button type="button" key={item} onClick={() => toggle(item)} aria-pressed={selected.includes(item)}>{selected.includes(item) ? '✓ ' : ''}{item}</button>)}
          </div>
        </fieldset>

        <label className="field" style={{ display: 'grid', gap: 8, marginTop: 28 }}>
          <span>What outcome matters most?</span>
          <textarea value={outcome} onChange={e => setOutcome(e.target.value)} rows={5} />
        </label>

        <button className="continue" style={{ marginTop: 28 }} disabled={busy || !story.trim() || !outcome.trim() || !selected.length} onClick={submit}>
          {busy ? 'Opening your dashboard…' : 'Finish questionnaire and open dashboard →'}
        </button>
        {error && <p role="alert" style={{ marginTop: 16 }}>{error}</p>}
      </section>
    </main>
  )
}
