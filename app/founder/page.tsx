import { redirect } from 'next/navigation'

/** Legacy founder entry point. Executive access is the canonical private cockpit. */
export default function FounderPage() {
  redirect('/executive')
}
