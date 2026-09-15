# AURAXHERO X — Artifact Filtration and Preservation

This file documents the filtration policy applied when establishing the Unified Kernel canonical source from the historical ZIP artifact.

Principles
- Preserve every existing artifact unless there is a concrete security, legal, privacy, corruption, or repository-integrity reason to remove it.
- Do not exclude ordinary source code solely because it is old, unused, experimental, or incomplete.
- The historical ZIP AURAXHERO_X_UNIFIED_KERNEL_0.2 3.zip at the repository root is the authoritative preserved artifact for Kernel 0.2 and must remain untouched.
- When extracting the ZIP to establish the canonical source tree, the following sensitive or live artifacts MUST NOT be imported into the canonical tree and must remain only inside the historical ZIP (or preserved in a hashed index):
  - database backups/dumps (e.g., *.sql, *.sqlite, *.bak, /backups/**)
  - .env files or any file containing secrets (e.g., *.env, .env.*)
  - private keys and certificates (e.g., *.pem, *.key, *.p12, *.jks, *.crt)
  - credentials, tokens, service-role/admin secrets (files named credentials*, token*, *secret*)
  - potentially live configuration that exposes secrets or operational access
  - unrelated Brindlewick material

Filtration actions
- Excluded artifacts will be:
  - Left only inside the historical ZIP (AURAXHERO_X_UNIFIED_KERNEL_0.2 3.zip).
  - Documented in /historical-excluded/index.json as an array of {"path": "<path/inside/zip>", "sha256": "<sha256>"} entries. The index contains filenames + SHA-256 only — never the file contents.
- The canonical source tree will be extracted from the ZIP with excluded files removed. Canonical tree must contain exactly one app/, one lib/, one package.json, etc. If collisions or duplicates are detected during extraction, extraction will stop and report the collision for human review.

Kernel 0.3 delta
- Kernel 0.3 must be applied as a delta on top of the extracted Kernel 0.2 canonical tree. Only files that actually changed in 0.3 will be added/modified. Unchanged files MUST NOT be duplicated or re-created.
- ARTIFACT_FILTRATION.md will be added to the canonical tree in Kernel 0.3 to record the filtration decisions and provenance.

Provenance
- Every file added or modified in the canonical tree must have provenance metadata (a comment header or a companion provenance manifest) indicating it originated from the historical ZIP and whether it was modified as part of the Kernel 0.3 delta. The automated process will record provenance in .provenance/manifest.json.

Verification
- Use the repository package.json scripts (if present) for dependency installation, typecheck, production build, and tests. Do not invent command names. Typical commands used by the automated script on CI or local run:
  - npm ci (or the package manager configured by the project)
  - npm run typecheck (or tsc --noEmit)
  - npm run build
  - npm test

If the automated process detects secrets, database backups, private keys, or Brindlewick material, it will NOT import them and will record them in /historical-excluded/index.json with SHA-256.

Contact
- This file is generated and committed by the repository automation to record the filtration policy used when establishing Kernel 0.3.
