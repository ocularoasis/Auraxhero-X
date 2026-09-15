import Link from 'next/link'
import { PublicShell } from '../components/public-shell'

const portals = [
  ['Founder access', '/login/founder', 'Highest human governance scope; requires verified founder authorization.'],
  ['Admin access', '/login/admin', 'Platform administration under least-privilege policy.'],
  ['Staff access', '/login/staff', 'Scoped operational access for authorized staff.'],
] as const

export default function LoginPage() {
  return (
    <PublicShell>
      <main className="page-shell shell">
        <p className="eyebrow">SECURE ACCESS</p>
        <h1>Sign in to Auraxhero X.</h1>
        <p className="lede">Choose the access surface you are authorized to use. Authentication and authorization remain server-side; a URL never grants a role.</p>
        <div className="info-grid">
          {portals.map(([title, href, text]) => (
            <Link className="info-card access-card" href={href} key={href}>
              <h2>{title}</h2>
              <p>{text}</p>
              <span className="text-link">Continue →</span>
            </Link>
          ))}
        </div>
      </main>
    </PublicShell>
  )
}
