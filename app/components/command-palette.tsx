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
      <button type="button" className="header-login" aria-label="Open command palette" aria-keyshortcuts="Control+K Meta+K" onClick={() => setOpen(true)} style={{ minWidth: 72, cursor: 'pointer' }}>
        ⌘K
      </button>

      {open && (
        <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false) }} style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'grid', placeItems: 'start center', padding: '12vh 16px 24px', background: 'rgba(0,0,0,.68)', backdropFilter: 'blur(8px)' }}>
          <section role="dialog" aria-modal="true" aria-label="Command palette" style={{ width: 'min(680px, 100%)', overflow: 'hidden', border: '1px solid #2b4f6d', borderRadius: 16, background: '#07101a', boxShadow: '0 30px 100px rgba(0,0,0,.55)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderBottom: '1px solid #18324a' }}>
              <span aria-hidden="true" style={{ color: '#7acbff', fontSize: 20 }}>⌕</span>
              <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the network or run a command…" aria-label="Search commands" style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: 'transparent', color: '#f4f7fb', fontSize: 16 }} />
              <kbd style={{ padding: '4px 7px', border: '1px solid #28445f', borderRadius: 6, color: '#8391a4', fontSize: 10 }}>ESC</kbd>
            </div>
            <div style={{ maxHeight: '55vh', overflowY: 'auto', padding: 8 }}>
              {filtered.length ? filtered.map((command) => (
                <button type="button" key={command.href} onClick={() => go(command.href)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '13px 14px', border: 0, borderRadius: 10, background: 'transparent', color: '#e9f2fc', textAlign: 'left', cursor: 'pointer' }} onMouseEnter={(event) => { event.currentTarget.style.background = '#0c1b2a' }} onMouseLeave={(event) => { event.currentTarget.style.background = 'transparent' }}>
                  <span><strong style={{ display: 'block', fontSize: 13 }}>{command.label}</strong><small style={{ display: 'block', marginTop: 3, color: '#7e91a5', fontSize: 11 }}>{command.hint}</small></span>
                  <span aria-hidden="true" style={{ color: '#70baff' }}>→</span>
                </button>
              )) : <p style={{ padding: '24px 14px', color: '#8798aa', fontSize: 12 }}>No matching public action.</p>}
            </div>
            <footer style={{ padding: '10px 16px', borderTop: '1px solid #18324a', color: '#687b90', fontSize: 10 }}>Public actions only · no hidden authority or fabricated capability</footer>
          </section>
        </div>
      )}
    </>
  )
}
