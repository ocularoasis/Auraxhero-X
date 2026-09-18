import { redirect } from 'next/navigation'
import { currentUser, supabaseRest } from '../../lib/deletemefast/supabase-http'

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect('/login?next=/dashboard')

  const customerResponse = await supabaseRest(
    'dmf_customers?select=id,display_name,email,case_code:onboarding_stage,onboarding_stage,onboarding_slideshow_completed_at,profile_completed_at,questionnaire_completed_at&limit=1',
    user.accessToken,
  )
  if (!customerResponse.ok) redirect('/login?next=/dashboard')
  const customers = await customerResponse.json()
  const customer = customers[0]
  if (!customer?.questionnaire_completed_at) redirect('/questionnaire')

  const receiptResponse = await supabaseRest(
    'dmf_service_receipts?select=id,amount_cents,currency,service_code,receipt_status,issued_at&receipt_status=eq.PAID&order=issued_at.desc&limit=1',
    user.accessToken,
  )
  const receipts = receiptResponse.ok ? await receiptResponse.json() : []

  const casesResponse = await supabaseRest(
    'dmf_cases?select=id,case_code,service_code,status,service_start_at,service_end_at,paid_at,created_at&order=created_at.desc&limit=10',
    user.accessToken,
  )
  const cases = casesResponse.ok ? await casesResponse.json() : []

  return (
    <main className="page-shell shell">
      <p className="eyebrow">YOUR PRIVATE TABLE</p>
      <h1>{customer.display_name || 'Your'} dashboard.</h1>
      <p className="lede">Your workspace shows verified profile state, payment records, case state, and work that has actually occurred.</p>
      <div className="info-grid" style={{ marginTop: 28 }}>
        <section className="info-card"><p className="eyebrow">PROFILE</p><h2>{customer.display_name}</h2><p>{customer.email}</p><p>Profile complete: yes</p></section>
        <section className="info-card"><p className="eyebrow">PAYMENT</p><h2>{receipts.length ? 'Verified' : 'Not verified'}</h2><p>{receipts[0] ? `${receipts[0].currency.toUpperCase()} ${(receipts[0].amount_cents / 100).toFixed(2)} · ${receipts[0].service_code ?? 'service'}` : 'No paid receipt is visible to this account.'}</p></section>
        <section className="info-card"><p className="eyebrow">CASES</p><h2>{cases.length}</h2><p>Case records tied to this authenticated customer.</p></section>
      </div>
      <section className="feature-panel" style={{ marginTop: 24 }}>
        <p className="eyebrow">CASE / TICKET</p>
        {cases.length ? cases.map((item: {case_code:string; service_code:string|null; status:string; paid_at:string|null}) => (
          <article key={item.case_code} style={{ borderTop: '1px solid rgba(255,255,255,.12)', padding: '18px 0' }}>
            <strong>{item.case_code}</strong><p>{item.service_code ?? 'Service'} · {item.status} · {item.paid_at ? 'Paid' : 'Awaiting payment record'}</p>
          </article>
        )) : <p>No case record has been created yet. A case is created only from verified payment/service authorization; this page does not invent one.</p>}
      </section>
    </main>
  )
}
