import { redirect } from 'next/navigation'
import { currentUser, supabaseRest } from '../../lib/deletemefast/supabase-http'
import ProfileForm from './profile-form'

export default async function ProfilePage() {
  const user = await currentUser()
  if (!user) redirect('/login?next=/profile')

  const response = await supabaseRest(
    'dmf_customers?select=display_name,email,onboarding_stage,profile_completed_at&limit=1',
    user.accessToken,
  )
  if (!response.ok) redirect('/login?next=/profile')
  const customers = await response.json()
  const customer = customers[0]

  return (
    <main className="page-shell shell">
      <section className="feature-panel" style={{ maxWidth: 720, margin: '56px auto' }}>
        <p className="eyebrow">PRIVATE PROFILE</p>
        <h1>Your DeleteMeFast profile.</h1>
        <p className="lede">This profile is the authenticated identity boundary for your private workspace. It is not a public directory profile.</p>
        <ProfileForm name={customer?.display_name ?? ''} email={customer?.email ?? user.email ?? ''} />
      </section>
    </main>
  )
}
