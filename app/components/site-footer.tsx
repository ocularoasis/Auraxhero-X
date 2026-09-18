import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>DELETEMEFAST</strong>
        <p>Online protection when something goes wrong.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/services">Services</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/about">How it works</Link>
        <Link href="/business">Business</Link>
      </nav>
      <span className="muted">© {new Date().getFullYear()} DeleteMeFast</span>
    </footer>
  )
}
