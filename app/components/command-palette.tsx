'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const commands = [
  { label: 'Open Deal Desk', hint: 'Start a commercial objective', href: '/deal-desk' },
  { label: 'Explore capabilities', hint: 'Browse published capabilities', href: '/marketplace' },
  { label: 'Machine access', hint: 'Open machine-readable discovery', href: '/machine' },
  { label: 'Documentation', hint: 'Read the public contract', href: '/documentation' },
]

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
      }
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const filtered = commands.filter((command) =>
    `${command.label} ${command.hint}`.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <>
      <button className="command-trigger" type="button" onClick={() => setOpen(true)} aria-label="Open command menu">
        <span>Search or command</span><kbd>⌘K</kbd>
      </button>
      {open && (
        <div className="command-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
          <section className="command-dialog" role="dialog" aria-modal="true" aria-label="Command menu" onMouseDown={(event) => event.stopPropagation()}>
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search capabilities or commands…" aria-label="Search commands" />
            <div className="command-list">
              {filtered.length === 0 ? <p className="command-empty">No matching public action.</p> : filtered.map((command) => (
                <button key={command.href} type="button" onClick={() => { setOpen(false); router.push(command.href) }}>
                  <strong>{command.label}</strong><span>{command.hint}</span>
                </button>
              ))}
            </div>
            <p className="command-foot">Esc to close · only published/public surfaces appear here</p>
          </section>
        </div>
      )}
    </>
  )
}
