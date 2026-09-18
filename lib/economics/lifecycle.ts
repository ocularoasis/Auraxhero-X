export const economicStates = [
  'intent','discovery','match','terms','authorization','payment','execution','evidence','settlement','reputation','next_opportunity',
] as const
export type EconomicState = (typeof economicStates)[number]

const transitions: Record<EconomicState, readonly EconomicState[]> = {
  intent: ['discovery'], discovery: ['match','intent'], match: ['terms','discovery'], terms: ['authorization','match'],
  authorization: ['payment','terms'], payment: ['execution','authorization'], execution: ['evidence','execution'],
  evidence: ['settlement','execution'], settlement: ['reputation'], reputation: ['next_opportunity'], next_opportunity: ['intent'],
}

export type EconomicTicket = {
  ticketId:string; principalId:string; authorizedActorId:string; capabilityId:string; intent:string; state:EconomicState;
  terms:{amountMinor:number; currency:string; unit:string}; authorityGrantId:string; authorityExpiresAt:string;
  maxSpendMinor:number; evidenceRequired:string[]; settlementCondition:string;
}

export function canTransition(from:EconomicState,to:EconomicState){ return transitions[from].includes(to) }

export function transition(ticket:EconomicTicket,to:EconomicState):EconomicTicket {
  if(!canTransition(ticket.state,to)) throw new Error(`Invalid economic transition: ${ticket.state} -> ${to}`)
  return {...ticket,state:to}
}

export function validateEconomicTicket(input:unknown):{success:true;data:EconomicTicket}|{success:false;error:string} {
  if(!input || typeof input!=='object') return {success:false,error:'ticket must be an object'}
  const v=input as Record<string,unknown>
  const required=['ticketId','principalId','authorizedActorId','capabilityId','intent','authorityGrantId','authorityExpiresAt','settlementCondition']
  for(const k of required) if(typeof v[k]!=='string' || !(v[k] as string).trim()) return {success:false,error:`${k} is required`}
  if(!economicStates.includes(v.state as EconomicState)) return {success:false,error:'invalid state'}
  if(!v.terms || typeof v.terms!=='object') return {success:false,error:'terms are required'}
  const t=v.terms as Record<string,unknown>
  if(!Number.isInteger(t.amountMinor)||Number(t.amountMinor)<0||typeof t.currency!=='string'||t.currency.length!==3||typeof t.unit!=='string'||!t.unit.trim()) return {success:false,error:'invalid terms'}
  if(!Number.isInteger(v.maxSpendMinor)||Number(v.maxSpendMinor)<0) return {success:false,error:'invalid maxSpendMinor'}
  if(!Array.isArray(v.evidenceRequired)||!v.evidenceRequired.every(x=>typeof x==='string'&&x.trim())) return {success:false,error:'invalid evidenceRequired'}
  if(typeof v.authorityExpiresAt!=='string'||Number.isNaN(Date.parse(v.authorityExpiresAt))) return {success:false,error:'invalid authorityExpiresAt'}
  return {success:true,data:v as unknown as EconomicTicket}
}
