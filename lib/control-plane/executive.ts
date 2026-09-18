import type { Principal } from './types'

const EXECUTIVE_EMAIL = 'ocularoasisnyc@gmail.com'

/** Executive access requires a real authenticated principal. */
export function isExecutivePrincipal(principal: Principal): boolean {
  if (!principal.authenticated || !principal.email) return false
  return principal.email.trim().toLowerCase() === EXECUTIVE_EMAIL
}

export function requireExecutive(principal: Principal): void {
  if (!isExecutivePrincipal(principal)) throw new Error('Executive authorization required')
}

export const executiveProfile = {
  email: EXECUTIVE_EMAIL,
  title: 'Executive',
  access: 'Executive site oversight',
  cockpitPath: '/executive',
} as const
