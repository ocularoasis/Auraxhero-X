import { redirect } from 'next/navigation'

/** Administrative authentication is centralized; authorization happens after authentication. */
export default function AdminLoginPage() {
  redirect('/login')
}
