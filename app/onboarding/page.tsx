import { redirect } from 'next/navigation'
import { currentUser, supabaseRest } from '../../lib/deletemefast/supabase-http'
import OnboardingSlides from './slides'

export default async function OnboardingPage() {
  const user = await currentUser()
  if (!user) redirect('/login?next=/onboarding')

  const response = await supabaseRest(
    'dmf_customers?select=id,display_name,email,onboarding_stage,onboarding_slideshow_completed_at,profile_completed_at,questionnaire_completed_at&limit=1',
    user.accessToken,
  )
  if (!response.ok) redirect('/login?next=/onboarding')

  const customers = await response.json()
  const customer = customers[0]
  if (!customer) redirect('/report')

  const paidResponse = await supabaseRest(
    'dmf_service_receipts?select=id&receipt_status=eq.PAID&limit=1',
    user.accessToken,
  )
  if (!paidResponse.ok || !(await paidResponse.json()).length) {
    redirect('/pricing?payment=required')
  }

  if (customer.questionnaire_completed_at) redirect('/dashboard')

  return (
    <main className="page-shell shell">
      <OnboardingSlides
        customer={{
          name: customer.display_name ?? '',
          email: customer.email ?? user.email ?? '',
          profileComplete: Boolean(customer.profile_completed_at),
          slideshowComplete: Boolean(customer.onboarding_slideshow_completed_at),
        }}
      />
    </main>
  )
}
