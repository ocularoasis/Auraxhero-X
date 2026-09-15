import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>AURAXHERO X</strong>
        <p>Useful capability for the machine era.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/documentation">Documentation</Link>
        <Link href="/about">About</Link>
        <Link href="/marketplace">Marketplace</Link>
        <Link href="/machine">Machine access</Link>
      </nav>
      <span className="muted">© {new Date().getFullYear()} Auraxhero X</span>
    </footer>
  )
}
