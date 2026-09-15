const capabilities = [
  {
    mark: "AI",
    title: "Web Intelligence",
    text: "Turn open-web questions into structured, useful research for people and agents.",
    tags: ["Research", "Data", "Agents"],
  },
  {
    mark: "◈",
    title: "Market Intelligence",
    text: "Find signals, compare opportunities, and turn changing information into decisions.",
    tags: ["Signals", "Analysis", "Monitoring"],
  },
  {
    mark: "↗",
    title: "Data & Charts",
    text: "Transform raw information into clear tables, visualizations, and decision-ready outputs.",
    tags: ["Charts", "Analytics", "Reports"],
  },
  {
    mark: "◎",
    title: "Media & Distribution",
    text: "Discover useful media, campaigns, audiences, and distribution opportunities.",
    tags: ["Media", "Reach", "Growth"],
  },
  {
    mark: "✦",
    title: "Machine Commerce",
    text: "Explore capabilities that machines can discover, request, evaluate, and pay for.",
    tags: ["x402", "Commerce", "Agents"],
  },
  {
    mark: "◇",
    title: "Custom Capabilities",
    text: "Compose existing tools or define a new capability around a real need.",
    tags: ["Compose", "Build", "Utility"],
  },
];

const categories = [
  ["Research & Data", "⌁"],
  ["AI & Agents", "✦"],
  ["Market Intelligence", "◈"],
  ["Development Tools", "⌘"],
  ["Web & Media", "◉"],
  ["Commerce", "$"],
  ["Security", "◇"],
  ["Jobs & Opportunities", "↗"],
];

export default function HomePage() {
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Auraxhero X home">
          <span className="brand-mark">A</span>
          <span>AURAXHERO X</span>
        </a>
        <nav className="nav" aria-label="Primary navigation">
          <a className="active" href="#top">Home</a>
          <a href="#agents">Agents</a>
          <a href="#capabilities">Tools</a>
          <a href="#marketplace">Marketplace</a>
          <a href="#network">Network</a>
          <a href="#documentation">Documentation</a>
          <a href="#about">About</a>
        </nav>
        <div className="top-actions">
          <label className="search">
            <span aria-hidden="true">⌕</span>
            <input aria-label="Search capabilities" placeholder="Search capabilities or ask a question" />
          </label>
          <a className="account" href="#account" aria-label="Open account">
            <span className="avatar">M</span>
            <span className="account-copy"><strong>Welcome</strong><small>Account</small></span>
          </a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-art" aria-hidden="true">
          <div className="sun" />
          <div className="mountain mountain-a" />
          <div className="mountain mountain-b" />
          <div className="city">
            {Array.from({ length: 18 }).map((_, i) => <i key={i} style={{ height: `${24 + ((i * 17) % 92)}px` }} />)}
          </div>
          <div className="horizon-grid" />
        </div>
        <div className="hero-content">
          <p className="eyebrow">THE MACHINE-ERA CAPABILITY NETWORK</p>
          <h1>Auraxhero X</h1>
          <p className="hero-lede">Real tools. Real agents. Real value.</p>
          <p className="hero-body">
            Discover useful capabilities for humans and machines — then connect the right capability to the right need.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#capabilities">Explore capabilities <span>→</span></a>
            <a className="button secondary" href="#agents">For agents <span>↗</span></a>
          </div>
          <div className="trust-strip" aria-label="Platform principles">
            <span><b>✦</b> Agent-ready</span>
            <span><b>◇</b> Machine commerce</span>
            <span><b>✓</b> Evidence-aware</span>
            <span><b>◎</b> Human useful</span>
          </div>
        </div>
        <aside className="hero-panel" aria-label="Auraxhero X introduction">
          <div className="panel-heading"><span>Capability Network</span><em><i /> Available</em></div>
          <div className="panel-visual">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="core">A</div>
          </div>
          <p>From a question to a useful capability — discover, connect, and move.</p>
          <a href="#marketplace">Browse the marketplace <span>→</span></a>
        </aside>
      </section>

      <section className="section" id="capabilities">
        <div className="section-head">
          <div><p className="eyebrow">DISCOVER</p><h2>Featured capabilities</h2></div>
          <a href="#marketplace">View all tools <span>→</span></a>
        </div>
        <div className="capability-grid">
          {capabilities.map((item) => (
            <article className="cap-card" key={item.title}>
              <div className="cap-icon">{item.mark}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className="tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <a href="#marketplace" aria-label={`Explore ${item.title}`}>Explore <span>→</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section" id="network">
        <div className="how-card">
          <div className="section-head compact"><div><p className="eyebrow">HOW IT WORKS</p><h2>Useful by design</h2></div></div>
          <p className="section-copy">Start with a need. Find a capability. Request an outcome. Keep the evidence that matters.</p>
          <div className="steps">
            {[['01','Discover'],['02','Request'],['03','Execute'],['04','Verify']].map(([num,label], i) => (
              <div className="step" key={label}><span>{num}</span><strong>{label}</strong>{i < 3 && <b>→</b>}</div>
            ))}
          </div>
          <a className="button secondary" href="#marketplace">Explore the marketplace <span>→</span></a>
        </div>
        <div className="category-card" id="marketplace">
          <div className="section-head compact"><div><p className="eyebrow">FIND YOUR STARTING POINT</p><h2>Popular categories</h2></div></div>
          <div className="category-grid">
            {categories.map(([name, icon]) => <a className="category" href="#capabilities" key={name}><span>{icon}</span>{name}<b>→</b></a>)}
          </div>
        </div>
      </section>

      <section className="agent-section" id="agents">
        <div className="agent-copy">
          <p className="eyebrow">FOR AI AGENTS</p>
          <h2>Capabilities machines can actually use.</h2>
          <p>Discover machine-readable services, request useful work, and receive structured results without forcing every task through a human interface.</p>
          <div className="agent-actions"><a className="button primary" href="#documentation">View agent documentation <span>→</span></a><a className="text-link" href="#marketplace">Browse capabilities</a></div>
        </div>
        <div className="request-card">
          <div className="request-top"><span>Example capability request</span><em>machine-readable</em></div>
          <pre>{`{
  "capability": "web_intelligence",
  "request": "find useful market signals",
  "format": "structured",
  "response": "evidence + result"
}`}</pre>
          <div className="request-foot"><span>Discover → Request → Result</span><b>Ready for agents</b></div>
        </div>
      </section>

      <section className="trust-section" id="about">
        <div className="trust-intro"><p className="eyebrow">BUILT AROUND USEFULNESS</p><h2>Less noise. More capability.</h2><p>Auraxhero X is designed to make useful work easier to discover, connect, and evaluate — without exposing machinery that belongs behind the experience.</p></div>
        <div className="trust-items">
          <div><span>01</span><h3>Evidence-aware</h3><p>Separate signals, hypotheses, and verified outcomes.</p></div>
          <div><span>02</span><h3>Human useful</h3><p>Complex machinery stays behind a clear experience.</p></div>
          <div><span>03</span><h3>Machine ready</h3><p>Useful capabilities can be discovered and composed programmatically.</p></div>
          <div><span>04</span><h3>Value first</h3><p>Optimize for outcomes, not decorative activity.</p></div>
        </div>
      </section>

      <section className="cta" id="documentation">
        <div><p className="eyebrow">THE NEXT CAPABILITY IS OUT THERE</p><h2>What does the world need that does not exist yet?</h2><p>Explore what exists now — or start with the problem you want solved.</p></div>
        <div className="cta-actions"><a className="button primary" href="#capabilities">Explore capabilities <span>→</span></a><a className="button ghost" href="#agents">Build for agents <span>↗</span></a></div>
      </section>

      <footer>
        <div className="footer-brand"><span className="brand-mark">A</span><strong>AURAXHERO X</strong><p>The machine-era capability network.</p></div>
        <div className="footer-links"><a href="#top">Home</a><a href="#agents">Agents</a><a href="#capabilities">Tools</a><a href="#marketplace">Marketplace</a><a href="#network">Network</a><a href="#documentation">Documentation</a><a href="#about">About</a></div>
        <div className="footer-bottom"><span>© 2026 Auraxhero X</span><span>Privacy · Terms · Security · Contact</span></div>
      </footer>
    </main>
  );
}
