"use client";

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './report.css';
import {
  buildEvidenceTargets,
  questionnaireContract,
  type IdentifierKind,
} from '../../lib/deletemefast/customer-journey';

type Stage = 'soft' | 'profile' | 'client' | 'verify' | 'evidence' | 'dashboard';

const softOptions = [
  'I am worried about personal information being exposed',
  'Someone is pretending to be me',
  'Private or intimate content is involved',
  'My account or identity may be compromised',
  'I found something suspicious online',
  'I need help understanding what is out there about me',
];

const impactOptions = [
  'Privacy',
  'Personal safety',
  'Work or reputation',
  'Family',
  'Financial risk',
  'Account security',
];

const identifierLabels: Record<IdentifierKind, string> = {
  NAME: 'Names / previous names',
  ADDRESS: 'Current or previous addresses',
  PHONE: 'Phone numbers',
  EMAIL: 'Email addresses',
  USERNAME: 'Usernames',
  ALIAS: 'Aliases / nicknames',
  DOMAIN: 'Domains / websites',
  ORGANIZATION: 'Employers / organizations',
  PLATFORM: 'Platforms / profiles',
};

export default function ReportPage() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('soft');
  const [softReason, setSoftReason] = useState('');
  const [softUrgency, setSoftUrgency] = useState('Not sure');
  const [clientStory, setClientStory] = useState('');
  const [impact, setImpact] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [verified, setVerified] = useState(false);
  const [profileAcknowledged, setProfileAcknowledged] = useState(false);
  const [evidenceAuthorized, setEvidenceAuthorized] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [ipEntitled, setIpEntitled] = useState(false);
  const [selectedIdentifiers, setSelectedIdentifiers] = useState<IdentifierKind[]>([
    'NAME',
    'ADDRESS',
    'PHONE',
    'EMAIL',
  ]);
  const [priority, setPriority] = useState('Exposure and where my information appears');

  const evidenceTargets = useMemo(
    () => buildEvidenceTargets(selectedIdentifiers),
    [selectedIdentifiers],
  );

  function toggleImpact(value: string) {
    setImpact((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  function toggleIdentifier(value: IdentifierKind) {
    setSelectedIdentifiers((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  const progress = {
    soft: 16,
    profile: 32,
    client: 48,
    verify: 64,
    evidence: 80,
    dashboard: 100,
  }[stage];

  if (stage === 'dashboard') {
    return (
      <main className="dmf-flow">
        <section className="flow-shell shell question-stage">
          <p className="eyebrow">PRIVATE ACCESS</p>
          <h1>Your private dashboard is protected.</h1>
          <p className="stage-lede">The public intake cannot open the dashboard. Sign in after payment verification to complete the required onboarding and private questionnaire.</p>
          <button className="continue" type="button" onClick={() => router.push('/login?next=/onboarding')}>Continue to secure account →</button>
        </section>
      </main>
    )
  }

  return (
    <main className="dmf-flow">
      <div className="flow-top">
        <div className="shell flow-bar">
          <Link href="/" className="flow-brand">DELETEMEFAST</Link>
          <span>Private intake</span>
          <span>{progress}% complete</span>
        </div>
      </div>

      <section className="flow-shell shell">
        <div className="flow-progress"><i style={{ width: `${progress}%` }} /></div>

        {stage === 'soft' && (
          <article className="question-stage">
            <p className="eyebrow">1 · BEFORE YOUR PROFILE</p>
            <h1>Start softly. Tell us what brought you here.</h1>
            <p className="stage-lede">No intimate details yet. This first pass only helps us understand why you came and whether you need immediate direction.</p>
            <div className="option-grid">
              {softOptions.map((option) => <button className={softReason === option ? 'selected' : ''} key={option} onClick={() => setSoftReason(option)}>{option}</button>)}
            </div>
            <label className="field"><span>Anything else you want us to know at this point?</span><textarea value={clientStory} onChange={(event) => setClientStory(event.target.value)} placeholder="Keep it general. You will get a private, more detailed questionnaire after profile setup." /></label>
            <label className="field"><span>How urgent does this feel?</span><select value={softUrgency} onChange={(event) => setSoftUrgency(event.target.value)}><option>Not sure</option><option>Today</option><option>This week</option><option>I am planning ahead</option></select></label>
            <button className="continue" disabled={!softReason} onClick={() => setStage('profile')}>Continue to profile setup →</button>
          </article>
        )}

        {stage === 'profile' && (
          <article className="question-stage">
            <p className="eyebrow">2 · CREATE YOUR PRIVATE PROFILE</p>
            <h1>Now give us a way to keep your work together.</h1>
            <p className="stage-lede">Your profile is the boundary for your private workspace and future case history. Production account creation and identity-provider wiring must happen here; this screen does not treat a browser value as authentication.</p>
            <div className="two-col">
              <label className="field"><span>Your name</span><input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></label>
              <label className="field"><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>
            </div>
            <label className="consent"><input type="checkbox" checked={profileAcknowledged} onChange={(event) => setProfileAcknowledged(event.target.checked)} /> <span>I understand that detailed information is collected only when needed for my case, and that identity verification is required before sensitive evidence searching.</span></label>
            <button className="continue" disabled={!name || !email || !profileAcknowledged} onClick={() => setStage('client')}>Create profile and continue →</button>
          </article>
        )}

        {stage === 'client' && (
          <article className="question-stage intimate">
            <p className="eyebrow">3 · PRIVATE CLIENT QUESTIONNAIRE</p>
            <h1>Now tell us what this is really about.</h1>
            <p className="stage-lede">This is the deeper conversation. Tell us the context, the impact, and what you want your life to look like after the problem is handled.</p>
            <label className="field"><span>What happened, in your own words?</span><textarea value={clientStory} onChange={(event) => setClientStory(event.target.value)} placeholder="Describe the situation as much as you are comfortable sharing." /></label>
            <fieldset><legend>What is affected?</legend><div className="option-grid compact">{impactOptions.map((option) => <button type="button" className={impact.includes(option) ? 'selected' : ''} key={option} onClick={() => toggleImpact(option)}>{option}</button>)}</div></fieldset>
            <label className="field"><span>What outcome matters most?</span><textarea placeholder="For example: understand what is exposed, stop further spread, recover an account, organize removal requests, or keep watch." /></label>
            <button className="continue" onClick={() => setStage('verify')}>Continue to identity verification →</button>
          </article>
        )}

        {stage === 'verify' && (
          <article className="question-stage verification-stage">
            <p className="eyebrow">4 · IDENTITY VERIFICATION GATE</p>
            <h1>Before we look for your sensitive identifiers, we verify that they belong to you.</h1>
            <p className="stage-lede">This is a real security boundary, not a questionnaire answer. A production verification provider must return the verified identity result before evidence searching is enabled.</p>
            <div className="verification-box"><span>◎</span><div><b>Verification provider connection</b><p>Ready for provider callback: verified identity, verification reference, timestamp, and scope.</p></div><strong>REQUIRED</strong></div>
            <label className="consent"><input type="checkbox" checked={verified} onChange={(event) => setVerified(event.target.checked)} /> <span>For this interface prototype, mark the verification gate as completed only when the production identity provider has actually verified me. This checkbox is not an authentication mechanism.</span></label>
            <button className="continue" disabled={!verified} onClick={() => setStage('evidence')}>Continue to evidence questionnaire →</button>
          </article>
        )}

        {stage === 'evidence' && (
          <article className="question-stage intimate">
            <p className="eyebrow">5 · EVIDENCE QUESTIONNAIRE</p>
            <h1>What should we look for?</h1>
            <p className="stage-lede">Choose the identifiers you authorize us to investigate. We can then search approved sources and return the actual observations to your table.</p>
            <div className="identifier-grid">
              {questionnaireContract.evidence.identifierKinds.map((kind) => (
                <button type="button" className={selectedIdentifiers.includes(kind) ? 'selected' : ''} key={kind} onClick={() => toggleIdentifier(kind)}>
                  <span>{selectedIdentifiers.includes(kind) ? '✓' : '○'}</span>{identifierLabels[kind]}
                </button>
              ))}
            </div>
            <label className="field"><span>What should we prioritize?</span><select value={priority} onChange={(event) => setPriority(event.target.value)}><option>Exposure and where my information appears</option><option>Where information is being sold or shared</option><option>Impersonation and identity misuse</option><option>Removal and opt-out opportunities</option><option>All of the above</option></select></label>
            <div className="notice"><b>What you will see</b><p>Each finding should identify the source, identifier observed, URL or reference when available, observation time, and the basis for any statement that a source sells or shares information. Unverified assumptions are not presented as facts.</p></div>
            <label className="consent"><input type="checkbox" checked={evidenceAuthorized} onChange={(event) => setEvidenceAuthorized(event.target.checked)} /> <span>I authorize DeleteMeFast to investigate only the identifiers I selected, using approved sources, and to show the resulting observations back to me. This authorization does not authorize unrelated searches.</span></label>
            <button className="continue" disabled={!selectedIdentifiers.length || !evidenceAuthorized} onClick={() => router.push('/login?next=/onboarding')}>Continue to secure account →</button>
          </article>
        )}
      </section>
    </main>
  );
}
