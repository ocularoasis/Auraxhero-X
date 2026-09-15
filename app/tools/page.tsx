import Link from 'next/link'
import { PublicShell } from '../components/public-shell'

const tools = [['Research', 'Evidence gathering, synthesis, and structured outputs.'], ['Data', 'Transform and reason over useful datasets and signals.'], ['Automation', 'Connect repeatable work into practical workflows.'], ['Compute', 'Match technical workloads to appropriate resources.']]

export default function ToolsPage() {
  return <PublicShell><section className="page-shell shell"><p className="eyebrow">TOOLS</p><h1>Useful building blocks.</h1><p className="lede">Browse the kinds of capability Auraxhero X is designed to make discoverable. A category is not a claim that a live provider exists inside it.</p><div className="info-grid">{tools.map(([title, text]) => <article className="info-card" key={title}><h2>{title}</h2><p>{text}</p></article>)}</div><div className="actions"><Link className="button primary" href="/marketplace">Check published capabilities →</Link></div></section></PublicShell>
}
