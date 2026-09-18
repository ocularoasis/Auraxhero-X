import { redirect } from 'next/navigation'

/** Legacy founder login entry point. Authentication remains centralized at /login. */
export default function FounderLoginPage() {
  redirect('/login?next=/executive')
}
