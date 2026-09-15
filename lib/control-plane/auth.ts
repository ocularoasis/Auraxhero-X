import type { Principal } from './types'

export interface AuthenticationProvider {
  resolve(request: Request): Promise<Principal>
}

export class UnconfiguredAuthenticationProvider implements AuthenticationProvider {
  async resolve(_request: Request): Promise<Principal> {
    return { id: 'anonymous', authenticated: false, roles: [] }
  }
}

// Deliberately unconfigured. Production identity must be supplied by a real provider;
// no cookie, URL, localStorage value, role string, or model output is treated as authority.
export const authenticationProvider: AuthenticationProvider = new UnconfiguredAuthenticationProvider()
