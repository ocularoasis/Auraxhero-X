import { redirect } from 'next/navigation'
import { currentUser, supabaseRest } from '../../../lib/deletemefast/supabase-http'

export default async function PaymentSuccessPage() {
  const user = await currentUser()
  if (!user) redirect('/login?next=/payment/success')

  const response = await supabaseRest(
    'dmf_service_receipts?select=id,case_id,amount_cents,currency,service_code,receipt_status,issued_at&receipt_status=eq.PAID&order=issued_at.desc&limit=1',
    user.accessToken,
  )
  if (!response.ok) redirect('/pricing?payment=verification-error')

  const receipts = await response.json()
  if (!receipts.length) redirect('/pricing?payment=not-verified')

  redirect('/onboarding')
}
