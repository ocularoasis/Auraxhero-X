import { redirect } from 'next/navigation'

/** Staff authentication is centralized; authorization happens after authentication. */
export default function StaffLoginPage() {
  redirect('/login')
}
