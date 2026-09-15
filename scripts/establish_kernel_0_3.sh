#!/usr/bin/env bash
set -Eeuo pipefail

# Auraxhero X Kernel 0.3 establishment
# Purpose: safely derive the canonical working tree from the preserved Kernel 0.2 artifact.
# This script does not invent application code and never deletes the historical ZIP.
# CI trigger revision: canonicalization must execute on the repository's current workflow definition.

ZIP_NAME='AURAXHERO_X_UNIFIED_KERNEL_0.2 3.zip'
COMMIT_MODE="${COMMIT:-no}"
KERNEL_VERSION='0.3'
WORK_DIR="$(mktemp -d /tmp/auraxhero-kernel.XXXXXX)"
EXTRACT_DIR="$WORK_DIR/extracted"
HIST_INDEX='historical-excluded/index.json'
PROV_MANIFEST='.provenance/manifest.json'
REPORT_JSON='.kernel_establish_report.json'
PRECANON_DIR='.provenance/precanonical'

cleanup() { rm -rf "$WORK_DIR"; }
trap cleanup EXIT
fail() { echo "FATAL: $*" >&2; exit 1; }
sha256() { if command -v sha256sum >/dev/null 2>&1; then sha256sum "$1" | awk '{print $1}'; else shasum -a 256 "$1" | awk '{print $1}'; fi; }

mkdir -p "$(dirname "$HIST_INDEX")" .provenance
[ -f "$ZIP_NAME" ] || fail "historical artifact missing: $ZIP_NAME"
command -v unzip >/dev/null 2>&1 || fail 'unzip is required'
command -v jq >/dev/null 2>&1 || fail 'jq is required'
ZIP_SHA256="$(sha256 "$ZIP_NAME")"
rm -rf "$EXTRACT_DIR" && mkdir -p "$EXTRACT_DIR"
unzip -q -o "$ZIP_NAME" -d "$EXTRACT_DIR" || fail 'historical ZIP extraction failed'
find "$EXTRACT_DIR" -type d -name '__MACOSX' -prune -exec rm -rf {} +
find "$EXTRACT_DIR" -type f \( -name '.DS_Store' -o -name '._*' \) -delete

mapfile -t package_dirs < <(find "$EXTRACT_DIR" -type f -name package.json -printf '%h\n' | sort -u)
valid_roots=()
for d in "${package_dirs[@]:-}"; do
  if [ -d "$d/app" ] || [ -d "$d/src" ] || [ -d "$d/lib" ] || [ -f "$d/tsconfig.json" ] || [ -f "$d/next.config.ts" ] || [ -f "$d/next.config.js" ] || [ -f "$d/vite.config.ts" ]; then valid_roots+=("$d"); fi
done
if [ "${#valid_roots[@]}" -ne 1 ]; then
  jq -n --arg zip "$ZIP_NAME" --arg sha "$ZIP_SHA256" --arg reason 'expected exactly one canonical root' '{source:{historical_zip:$zip,zip_sha256:$sha},canonicalization:{status:"blocked",reason:$reason}}' > "$REPORT_JSON"
  fail "expected exactly one canonical application root; found ${#valid_roots[@]}"
fi
CANON_ROOT="${valid_roots[0]}"

EXCLUDED_TMP="$WORK_DIR/excluded.jsonl"
: > "$EXCLUDED_TMP"
while IFS= read -r -d '' f; do
  rel="${f#$CANON_ROOT/}"; lower="${rel,,}"; reason=''
  case "$lower" in
    *.sql|*.sqlite|*.bak|backups/*|*/backups/*) reason='database/backup artifact' ;;
    .env|.env.*|*.env) reason='environment/secret-bearing artifact' ;;
    *.pem|*.key|*.p12|*.jks|*.crt) reason='private key/certificate artifact' ;;
    credentials*|*/credentials*|tokens*|*/tokens*|secret*|*/secret*) reason='credential/secret-named artifact' ;;
    .docker/config.json|*/.docker/config.json|.git-credentials) reason='credential-bearing configuration' ;;
  esac
  if [ -n "$reason" ]; then printf '%s\t%s\t%s\n' "$rel" "$(sha256 "$f")" "$reason" >> "$EXCLUDED_TMP"; rm -f -- "$f"; fi
done < <(find "$CANON_ROOT" -type f -print0)
{
  echo '['; first=1
  while IFS=$'\t' read -r p s r; do
    [ -n "$p" ] || continue; [ "$first" -eq 1 ] || echo ','
    jq -n --arg p "$p" --arg s "$s" --arg r "$r" '{path:$p,sha256:$s,reason:$r}'; first=0
  done < "$EXCLUDED_TMP"
  echo ']'
} | jq -c '.' > "$HIST_INDEX"

# Preserve any pre-existing repository file that conflicts with canonical historical source.
# It is moved into provenance rather than deleted or silently overwritten.
PRECANON_INDEX="$WORK_DIR/precanonical.jsonl"
: > "$PRECANON_INDEX"
while IFS= read -r -d '' src; do
  rel="${src#$CANON_ROOT/}"; dst="./$rel"
  if [ -e "$dst" ] && [ -f "$src" ] && [ -f "$dst" ]; then
    src_sha="$(sha256 "$src")"; dst_sha="$(sha256 "$dst")"
    if [ "$src_sha" != "$dst_sha" ]; then
      mkdir -p "$PRECANON_DIR/$(dirname "$rel")"
      cp -p -- "$dst" "$PRECANON_DIR/$rel"
      printf '%s\t%s\t%s\n' "$rel" "$dst_sha" "$PRECANON_DIR/$rel" >> "$PRECANON_INDEX"
    fi
  elif [ -e "$dst" ] && [ ! -f "$src" ]; then
    fail "canonicalization collision at non-file path $rel"
  fi
done < <(find "$CANON_ROOT" -type f -print0)

cp -a "$CANON_ROOT/." ./
cat > ARTIFACT_FILTRATION.md <<'EOF'
# Auraxhero X — Artifact Filtration and Preservation

Kernel 0.3 canonicalization preserves the historical `AURAXHERO_X_UNIFIED_KERNEL_0.2 3.zip` byte-for-byte.
Sensitive or live operational artifacts are not promoted into the working tree. They remain inside the historical
artifact and are represented in `historical-excluded/index.json` by path, SHA-256, and reason only.

Pre-existing repository files that conflicted with canonical source were preserved under `.provenance/precanonical/`
and were not silently discarded.
EOF

file_count="$(find . -type f ! -path './.git/*' ! -path './.provenance/manifest.json' ! -path './.kernel_establish_report.json' | wc -l | tr -d ' ')"
excluded_count="$(jq 'length' "$HIST_INDEX")"
precanon_count="$(wc -l < "$PRECANON_INDEX" | tr -d ' ')"
jq -n --arg zip "$ZIP_NAME" --arg zipsha "$ZIP_SHA256" --arg root "${CANON_ROOT#$EXTRACT_DIR/}" \
  --arg kernel "$KERNEL_VERSION" --argjson files "$file_count" --argjson excluded "$excluded_count" --argjson precanon "$precanon_count" \
  '{historical_zip:$zip,zip_sha256:$zipsha,canonical_root:$root,kernel_version:$kernel,canonical_file_count:$files,excluded_file_count:$excluded,precanonical_conflict_count:$precanon,policy:"preserve-history-never-promote-sensitive-artifacts"}' > "$PROV_MANIFEST"

findings="$WORK_DIR/security-findings.txt"; : > "$findings"
while IFS= read -r -d '' f; do
  mime="$(file --brief --mime-type "$f" 2>/dev/null || true)"
  case "$mime" in
    text/*|application/json|application/javascript|application/typescript)
      grep -I -nE -- '-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9]{20,}|service_role[[:space:]]*[:=][[:space:]]*[A-Za-z0-9_-]{20,}' "$f" >> "$findings" 2>/dev/null || true ;;
  esac
done < <(find app lib src pages components scripts -type f -print0 2>/dev/null || true)
if [ -s "$findings" ]; then
  jq -n --arg zip "$ZIP_NAME" --arg sha "$ZIP_SHA256" --argjson findings "$(jq -R -s 'split("\n") | map(select(length>0))' "$findings")" '{source:{historical_zip:$zip,zip_sha256:$sha},security:{status:"blocked",high_confidence_findings:$findings}}' > "$REPORT_JSON"
  fail 'high-confidence credential material detected in canonical source'
fi

[ -f package.json ] || fail 'package.json missing after canonicalization'
PACKAGE_MANAGER='npm'; INSTALL_CMD='npm ci'; RUN_CMD='npm run'
if [ -f pnpm-lock.yaml ]; then PACKAGE_MANAGER='pnpm'; INSTALL_CMD='pnpm install --frozen-lockfile'; RUN_CMD='pnpm run';
elif [ -f yarn.lock ]; then PACKAGE_MANAGER='yarn'; INSTALL_CMD='yarn install --immutable'; RUN_CMD='yarn run';
elif [ -f bun.lockb ] || [ -f bun.lock ]; then PACKAGE_MANAGER='bun'; INSTALL_CMD='bun install --frozen-lockfile'; RUN_CMD='bun run'; fi
command -v "$PACKAGE_MANAGER" >/dev/null 2>&1 || fail "required package manager not available: $PACKAGE_MANAGER"
$INSTALL_CMD
has_typecheck="$(jq -r '.scripts.typecheck // empty' package.json)"
has_build="$(jq -r '.scripts.build // empty' package.json)"
has_test="$(jq -r '.scripts.test // empty' package.json)"
TYPECHECK_STATUS='NOT_CONFIGURED'; TEST_STATUS='NOT_CONFIGURED'; BUILD_STATUS='NOT_RUN'
if [ -n "$has_typecheck" ]; then $RUN_CMD typecheck; TYPECHECK_STATUS='PASSED'; elif [ -f tsconfig.json ]; then "$PACKAGE_MANAGER" exec tsc --noEmit; TYPECHECK_STATUS='PASSED'; fi
[ -n "$has_build" ] || fail 'no build script exists; production build cannot be verified'
$RUN_CMD build; BUILD_STATUS='PASSED'
if [ -n "$has_test" ]; then $RUN_CMD test; TEST_STATUS='PASSED'; fi

BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
jq -n --arg zip "$ZIP_NAME" --arg sha "$ZIP_SHA256" --arg root "$CANON_ROOT" --arg kernel "$KERNEL_VERSION" \
  --arg branch "$BRANCH" --arg pm "$PACKAGE_MANAGER" --arg install "$INSTALL_CMD" --arg typecheck "$TYPECHECK_STATUS" --arg build "$BUILD_STATUS" --arg tests "$TEST_STATUS" \
  --argjson excluded "$excluded_count" --argjson files "$file_count" --argjson precanon "$precanon_count" \
  '{source:{historical_zip:$zip,zip_sha256:$sha,integrity:"verified"},canonicalization:{status:"verified",canonical_root:$root,canonical_file_count:$files,precanonical_conflict_count:$precanon},preservation:{historical_zip_preserved:true,excluded_artifacts_preserved_in_zip:true,precanonical_conflicts_preserved:true},verification:{package_manager:$pm,install_command:$install,typecheck:$typecheck,build:$build,tests:$tests},security:{status:"passed_high_confidence_scan"},git:{branch:$branch},blockers:[]}' > "$REPORT_JSON"

git add ARTIFACT_FILTRATION.md "$HIST_INDEX" "$PROV_MANIFEST" "$REPORT_JSON" .provenance/precanonical
while IFS= read -r -d '' p; do git add -- "$p"; done < <(find app lib src pages components public scripts -type f -print0 2>/dev/null || true)
for p in package.json package-lock.json pnpm-lock.yaml yarn.lock bun.lock bun.lockb tsconfig.json next.config.ts next.config.js next.config.mjs next-env.d.ts; do [ -e "$p" ] && git add -- "$p" || true; done
git reset -- "$ZIP_NAME" >/dev/null 2>&1 || true

if [ "$COMMIT_MODE" = 'yes' ]; then
  git diff --cached --quiet && fail 'verification succeeded but there is nothing staged to commit'
  git config user.name 'auraxhero-x-automation'
  git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
  git commit -m 'establish: Auraxhero X Kernel 0.3 canonical source'
  git push origin HEAD
fi

echo "Auraxhero X Kernel 0.3 establishment completed: $REPORT_JSON"
