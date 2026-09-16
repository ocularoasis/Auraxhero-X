'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const commands = [
  { label: 'Open Deal Desk', hint: 'Start a commercial objective', href: '/deal-desk' },
  { label: 'Explore capabilities', hint: 'Browse published capabilities', href: '/marketplace' },
  { label: 'Open machine access', hint: 'Machine-readable discovery', href: '/machine' },
  { label: 'Read documentation', hint: 'Inspect the public contracts', href: '/documentation' },
  { label: 'View agents', hint: 'Inspect the public agent surface', href: '/agents' },
  { label: 'View tools', hint: 'Inspect available tools', href: '/tools' },
  { label: 'Open network', hint: 'Explore network services', href: '/network' },
  { label: 'Sign in', hint: 'Authenticate', href: '/login' },
]

export function CommandPalette() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((command) => `${command.label} ${command.hint}`.toLowerCase().includes(q))
  }, [query])

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

  useEffect(() => {
    if (open) {
      setQuery('')
      window.setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  const go = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      <button
        type="button"
        className="command-trigger"
        aria-label="Open command palette"
        aria-keyshortcuts="Control+K Meta+K"
        onClick={() => setOpen(true)}
      >
        <span>⌘K</span>
        <span>Command</span>
      </button>

      {open && (
        <div className="command-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false) }}>
          <section className="command-dialog" role="dialog" aria-modal="true" aria-label="Command palette">
            <div className="command-search-row">
              <span aria-hidden="true">⌕</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the network or run a command…"
                aria-label="Search commands"
              />
              <kbd>ESC</kbd>
            </div>
            <div className="command-list">
              {filtered.length ? filtered.map((command) => (
                <button type="button" className="command-item" key={command.href} onClick={() => go(command.href)}>
                  <span>
                    <strong>{command.label}</strong>
                    <small>{command.hint}</small>
                  </span>
                  <span aria-hidden="true">→</span>
                </button>
              )) : <p className="command-empty">No matching public action.</p>}
            </div>
            <footer className="command-footer">Public actions only · no hidden authority or fabricated capability</footer>
          </section>
        </div>
      )}
    </>
  )
}
