'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const [busy,setBusy]=useState(false)

  async function submit() {
    setBusy(true); setError('')
    const response = await fetch('/api/auth/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password})})
    const data = await response.json().catch(()=>({}))
    if(!response.ok){setError(data.error ?? 'Unable to create account.');setBusy(false);return}
    if(data.authenticated) router.push('/onboarding')
    else router.push('/login?confirmed=required')
  }

  return <main className="page-shell shell"><section className="feature-panel" style={{maxWidth:560,margin:'72px auto'}}><p className="eyebrow">CREATE PRIVATE ACCOUNT</p><h1>Start your DeleteMeFast workspace.</h1><div style={{display:'grid',gap:16,marginTop:28}}><label>Name<input value={name} onChange={e=>setName(e.target.value)} autoComplete="name"/></label><label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" autoComplete="email"/></label><label>Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" autoComplete="new-password"/></label><button className="continue" disabled={busy||!name||!email||password.length<8} onClick={submit}>{busy?'Creating…':'Create account →'}</button>{error&&<p role="alert">{error}</p>}</div></section></main>
}
