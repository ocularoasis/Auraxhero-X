import Link from 'next/link'
import { CommandPalette } from './command-palette'

const nav = [
  ['Home', '/'],
  ['Agents', '/agents'],
  ['Tools', '/tools'],
  ['Marketplace', '/marketplace'],
  ['Network', '/network'],
  ['Documentation', '/documentation'],
  ['About', '/about'],
] as const

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Auraxhero X home">
        <span className="brand-mark" aria-hidden="true">A</span>
        <span>AURAXHERO X</span>
      </Link>
      <nav aria-label="Primary navigation">
        {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
      <div className="header-actions">
        <form className="search" action="/marketplace">
          <label htmlFor="site-search" className="sr-only">Search capabilities and tools</label>
          <input id="site-search" name="q" placeholder="Search capabilities, tools, or ask a question" />
        </form>
        <CommandPalette />
        <Link className="header-login" href="/login">Sign in</Link>
      </div>
    </header>
  )
}
