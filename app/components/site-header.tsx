import Link from 'next/link'

const nav = [
  ['Get Help', '/report'],
  ['Services', '/services'],
  ['Pricing', '/pricing'],
  ['How It Works', '/about'],
] as const

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="DeleteMeFast home">
        <span className="brand-mark" aria-hidden="true">D</span>
        <span>DELETEMEFAST</span>
      </Link>
      <nav aria-label="Primary navigation">
        {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
      <div className="header-actions">
        <form className="search" action="/report">
          <label htmlFor="site-search" className="sr-only">Find help</label>
          <input id="site-search" name="q" placeholder="What happened?" />
        </form>
        <Link className="header-login" href="/login">Sign in</Link>
      </div>
    </header>
  )
}
