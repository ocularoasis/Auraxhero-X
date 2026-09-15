import { AgentIdentity } from './types'

// No autonomous agents are instantiated in bootstrap state.
const agents: AgentIdentity[] = []

export function listAgents(): AgentIdentity[] {
  return agents
}

export function assertAuthority(agent: AgentIdentity, requiredAuthority: string) {
  if (agent.status !== 'ACTIVE' || !agent.authority.includes(requiredAuthority)) {
    throw new Error('Agent lacks active authority for this operation')
  }
}
