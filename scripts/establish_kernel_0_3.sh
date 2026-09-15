#!/usr/bin/env bash
set -euo pipefail

# Strict deterministic Kernel 0.3 establishment script
# Requirements enforced per Auraxhero X directive

ZIP_NAME="AURAXHERO_X_UNIFIED_KERNEL_0.2 3.zip"
COMMIT_MODE="${COMMIT:-no}"
KERNEL_VERSION="0.3"
WORK_TMP_ROOT=".kernel_extract_workdir"
EXTRACT_DIR="$WORK_TMP_ROOT/extracted"
HIST_INDEX="historical-excluded/index.json"
PROV_DIR=".provenance"
PROV_MANIFEST="$PROV_DIR/manifest.json"
REPORT_JSON=".kernel_establish_report.json"

# Exclusion patterns (exact and sensible patterns)
EXCLUDE_PATTERNS=("*.sql" "*.sqlite" "*.bak" "backups/*" "*.env" ".env*" "*.pem" "*.key" "*.p12" "*.jks" "*.crt" "credentials*" "tokens*" ".docker/config.json" ".git-credentials" "secret*")

# helper: fail with message
fail() {
  echo "FATAL: $*" >&2
  exit 1
}

echo "[kernel-establish] start: commit_mode=$COMMIT_MODE"

# 1) ensure ZIP exists at repo root and compute SHA256
if [ ! -f "$ZIP_NAME" ]; then
  fail "Historical ZIP '$ZIP_NAME' not found in repository root"
fi

if command -v sha256sum >/dev/null 2>&1; then
  ZIP_SHA256=$(sha256sum "$ZIP_NAME" | awk '{print $1}')
elif command -v shasum >/dev/null 2>&1; then
  ZIP_SHA256=$(shasum -a 256 "$ZIP_NAME" | awk '{print $1}')
else
  fail "No sha256 tool available (sha256sum or shasum required)"
fi

echo "[kernel-establish] historical ZIP: $ZIP_NAME"
echo "[kernel-establish] SHA256: $ZIP_SHA256"

# 2) prepare clean temporary workspace
rm -rf "$WORK_TMP_ROOT"
mkdir -p "$EXTRACT_DIR"

# 3) extract into temporary workspace
echo "[kernel-establish] extracting ZIP into $EXTRACT_DIR"
unzip -q "$ZIP_NAME" -d "$EXTRACT_DIR" || fail "unzip failed"

# 4) remove macOS metadata and AppleDouble
echo "[kernel-establish] removing macOS metadata"
find "$EXTRACT_DIR" -name '__MACOSX' -prune -exec rm -rf {} +
find "$EXTRACT_DIR" -name '.DS_Store' -type f -delete
# remove AppleDouble files (._*)
find "$EXTRACT_DIR" -name '._*' -type f -delete || true

# 5) discover candidate canonical roots
# Rule: canonical root = dir containing package.json AND (app/ OR lib/ OR tsconfig.json OR next.config.ts OR next.config.js)
mapfile -t package_dirs < <(find "$EXTRACT_DIR" -type f -name 'package.json' -printf '%h\n' | sort -u)

valid_roots=()
for pd in "${package_dirs[@]:-}"; do
  if [ -d "$pd/app" ] || [ -d "$pd/lib" ] || [ -f "$pd/tsconfig.json" ] || [ -f "$pd/next.config.ts" ] || [ -f "$pd/next.config.js" ]; then
    valid_roots+=("$pd")
  fi
done

if [ ${#valid_roots[@]} -eq 0 ]; then
  echo "ERROR: no canonical source root found. package.json located in: ${package_dirs[*]:-none}" >&2
  jq -n --arg zip "$ZIP_NAME" --arg zipsha "$ZIP_SHA256" '{source:{historical_zip:$zip,zip_sha256:$zipsha,integrity:"unverified"},canonicalization:{status:"failed",reason:"no-canonical-root"}}' > "$REPORT_JSON" || true
  fail "no canonical source root found"
fi

if [ ${#valid_roots[@]} -gt 1 ]; then
  echo "ERROR: multiple canonical roots detected: ${valid_roots[*]}" >&2
  jq -n --arg zip "$ZIP_NAME" --arg zipsha "$ZIP_SHA256" --argjson candidates "$(printf '%s\n' "${valid_roots[@]}" | jq -R -s -c 'split("\n")[:-1]')" '{source:{historical_zip:$zip,zip_sha256:$zipsha},canonicalization:{status:"failed",reason:"multiple-canonical-roots",candidates:$candidates}}' > "$REPORT_JSON" || true
  fail "multiple canonical roots detected"
fi

CANON_ROOT="${valid_roots[0]}"
echo "[kernel-establish] canonical root discovered: $CANON_ROOT"

# 6) verify canonical root contains package.json
if [ ! -f "$CANON_ROOT/package.json" ]; then
  fail "canonical root missing package.json"
fi

# 7) collision safety: ensure repository root does not already contain canonical root artifacts
collisions_found=()
for p in app lib package.json; do
  if [ -e "$p" ]; then
    collisions_found+=("$p")
  fi
done
if [ ${#collisions_found[@]} -gt 0 ]; then
  echo "ERROR: collision detected in branch working tree: ${collisions_found[*]}" >&2
  jq -n --arg zip "$ZIP_NAME" --arg zipsha "$ZIP_SHA256" --argjson collisions "$(printf '%s\n' "${collisions_found[@]}" | jq -R -s -c 'split("\n")[:-1]')" '{source:{historical_zip:$zip,zip_sha256:$zipsha},canonicalization:{status:"failed",reason:"collision",collisions:$collisions}}' > "$REPORT_JSON" || true
  fail "collision detected in repo root: ${collisions_found[*]}"
fi

# 8) prepare historical-excluded index
mkdir -p "$(dirname "$HIST_INDEX")"
# start empty array
jq -n '[]' > "$HIST_INDEX"

# 9) scan for excluded artifacts under the canonical root; classify and record only metadata
excluded_list=()
while IFS= read -r -d $'\0' file; do
  relpath="${file#$CANON_ROOT/}"
  classification=""
  reason=""
  for pat in "${EXCLUDE_PATTERNS[@]}"; do
    # Use bash pattern matching; convert pat to glob
    if [[ "$relpath" == $pat || "$relpath" == ${pat#*/} || "$relpath" == */${pat#*/} || "$relpath" == *"${pat%*}"* ]]; then
      classification="$pat"
      reason="matched pattern $pat"
      break
    fi
  done
  # content/path-based checks
  lower=$(printf '%s' "$relpath" | tr '[:upper:]' '[:lower:]')
  if [ -z "$classification" ]; then
    if [[ "$lower" == *"privatekey"* || "$lower" == *".pem" || "$lower" == *"certificate"* ]]; then
      classification="sensitive:key"
      reason="filename suggests key/certificate"
    fi
  fi
  if [ -n "$classification" ]; then
    if command -v sha256sum >/dev/null 2>&1; then
      sha=$(sha256sum "$file" | awk '{print $1}')
    else
      sha=$(shasum -a 256 "$file" | awk '{print $1}')
    fi
    entry=$(jq -n --arg p "$relpath" --arg s "$sha" --arg c "$classification" --arg r "$reason" '{path:$p,sha256:$s,classification:$c,reason:$r}')
    excluded_list+=("$entry")
    rm -f "$file" || fail "failed to remove excluded file $file"
  fi
done < <(find "$CANON_ROOT" -type f -print0)

# write historical index
if [ ${#excluded_list[@]} -gt 0 ]; then
  # build JSON array safely
  printf '%s\n' "[${excluded_list[*]}]" | jq -c '.' > "$HIST_INDEX" || fail "failed to write $HIST_INDEX"
else
  jq -n '[]' > "$HIST_INDEX"
fi

# 10) create provenance manifest
mkdir -p "$PROV_DIR"
extracted_at=$(date --iso-8601=seconds)
# compute imported list
mapfile -t imported_files < <(cd "$CANON_ROOT" && find . -type f -print | sed 's|^./||')
imported_count=${#imported_files[@]}
excluded_count=$(jq length "$HIST_INDEX")

jq -n --arg zip "$ZIP_NAME" --arg zipsha "$ZIP_SHA256" --arg extracted_at "$extracted_at" \
  --arg canon_root "${CANON_ROOT#$EXTRACT_DIR/}" --arg kernel_version "$KERNEL_VERSION" \
  --argjson imported_count "$imported_count" --argjson excluded_count "$excluded_count" \
  '{historical_zip:$zip,zip_sha256:$zipsha,extracted_at:$extracted_at,canonical_root:$canon_root,kernel_version:$kernel_version,imported_file_count:$imported_count,excluded_file_count:$excluded_count}' > "$PROV_MANIFEST" || fail "failed to write provenance manifest"

# 11) copy canonical files into repo root carefully
# copy directory contents without creating nested app/app etc.
echo "[kernel-establish] copying canonical root contents to repo root"
# Use rsync-like behavior via tar to preserve paths
pushd "$CANON_ROOT" >/dev/null
# create list of files
mapfile -t file_list < <(find . -type f -print)
if [ ${#file_list[@]} -eq 0 ]; then
  fail "no files found inside canonical root"
fi
for f in "${file_list[@]}"; do
  # remove leading ./
  rel=${f#./}
  dest_dir=$(dirname "$rel")
  mkdir -p "$PWD/../.."/"$dest_dir"
  cp -p -- "$rel" "$PWD/../.."/"$dest_dir/" || cp -p "$rel" "$PWD/../.."/"$dest_dir/"
done
popd >/dev/null

# verify no nested app/app or lib/lib
if [ -d "app/app" ] || [ -d "lib/lib" ]; then
  fail "nested app/app or lib/lib detected after copy"
fi

# 12) security scan imported files (heuristic)
echo "[kernel-establish] security scan of imported files"
suspicious=()
while IFS= read -r -d $'\0' f; do
  # check text files only
  mime=$(file --brief --mime-type "$f" 2>/dev/null || echo "")
  if [[ "$mime" == text/* || "$mime" == application/javascript || "$mime" == application/json ]]; then
    if grep -I -nE "(password|passwd|api[_-]?key|secret|token|access[_-]?token|private[_-]?key|PRIVATE_KEY)" "$f" >/dev/null 2>&1; then
      suspicious+=("$f")
    fi
  fi
done < <(find app lib . -maxdepth 5 -type f -print0 2>/dev/null || true)

if [ ${#suspicious[@]} -gt 0 ]; then
  echo "ERROR: suspicious potential secrets detected:" >&2
  for s in "${suspicious[@]}"; do echo " - $s" >&2; done
  jq -n --arg zip "$ZIP_NAME" --arg zipsha "$ZIP_SHA256" --argjson suspicious "$(printf '%s\n' "${suspicious[@]}" | jq -R -s -c 'split("\n")[:-1]')" '{source:{historical_zip:$zip,zip_sha256:$zipsha},security:{status:"failed",suspicious:$suspicious}}' > "$REPORT_JSON" || true
  fail "security scan failed"
fi

# 13) prepare for verification: determine package manager and scripts
PM="npm"
INSTALL_CMD="npm ci"
if [ -f yarn.lock ]; then
  PM="yarn"
  INSTALL_CMD="yarn install --frozen-lockfile"
elif [ -f pnpm-lock.yaml ]; then
  PM="pnpm"
  INSTALL_CMD="pnpm install --frozen-lockfile"
fi

# ensure package.json exists at repo root
if [ ! -f package.json ]; then
  fail "package.json not found at repo root after canonicalization"
fi

# read scripts from package.json
has_typecheck=$(jq -r '.scripts.typecheck // empty' package.json || echo "")
has_build=$(jq -r '.scripts.build // empty' package.json || echo "")
has_test=$(jq -r '.scripts.test // empty' package.json || echo "")

# 14) install dependencies
echo "[kernel-establish] installing dependencies using $INSTALL_CMD"
$INSTALL_CMD || fail "dependency installation failed (command: $INSTALL_CMD)"

# 15) typecheck
if [ -n "$has_typecheck" ]; then
  echo "[kernel-establish] running typecheck via 'npm run typecheck'"
  npm run typecheck || fail "typecheck failed"
elif [ -f tsconfig.json ]; then
  echo "[kernel-establish] running tsc --noEmit"
  npx tsc --noEmit || fail "tsc typecheck failed"
else
  echo "[kernel-establish] no typecheck configured; proceeding (reported as NOT CONFIGURED)"
fi

# 16) build (production verification required)
if [ -n "$has_build" ]; then
  echo "[kernel-establish] running build via 'npm run build'"
  npm run build || fail "build failed"
else
  fail "No build script found in package.json — production verification cannot be claimed"
fi

# 17) tests (optional)
if [ -n "$has_test" ]; then
  echo "[kernel-establish] running tests via 'npm test'"
  npm test || fail "tests failed"
else
  echo "[kernel-establish] no test script configured — reported as NOT CONFIGURED"
fi

# 18) stage intended files explicitly (do NOT stage ZIP or temp files)
echo "[kernel-establish] staging intended files for commit"
# mandatory provenance and index
git add "$HIST_INDEX" "$PROV_MANIFEST" "$REPORT_JSON"
# canonical tree items
for p in app lib package.json tsconfig.json next.config.ts next.config.js next-env.d.ts ARTIFACT_FILTRATION.md; do
  if [ -e "$p" ]; then
    git add "$p"
  fi
done

# ensure ZIP is not staged
git reset -- "$ZIP_NAME" || true
# ensure temp workspace not staged
git reset -- "$WORK_TMP_ROOT" || true

# 19) if commit=yes, commit & push
if [ "$COMMIT_MODE" = "yes" ]; then
  if git diff --staged --quiet; then
    echo "[kernel-establish] nothing to commit"
  else
    git commit -m "Establish Auraxhero X Kernel 0.3 canonical source" || fail "git commit failed"
    git push origin HEAD || fail "git push failed"
    commit_sha=$(git rev-parse HEAD)
  fi
else
  echo "[kernel-establish] COMMIT_MODE is not 'yes'; skipping commit (dry-run)"
fi

# 20) final report
jq -n --arg zip "$ZIP_NAME" --arg zipsha "$ZIP_SHA256" --arg canon "$CANON_ROOT" --arg extracted_at "$extracted_at" --arg kernel "$KERNEL_VERSION" \
  --argjson imported_count "$imported_count" --argjson excluded_count "$excluded_count" \
  --arg commit_mode "$COMMIT_MODE" --arg commit_sha "${commit_sha:-null}" \
  '{SOURCE:{historical_zip:$zip,zip_sha256:$zipsha,integrity:"verified"},CANONICALIZATION:{canonical_root:$canon,imported_file_count:$imported_count},FILTERING:{excluded_count:$excluded_count,index:"historical-excluded/index.json"},PRESERVATION:{historical_zip_preserved:true,ordinary_source_preserved:true,temporary_artifacts_committed:false},PROVENANCE:{manifest:".provenance/manifest.json"},VERIFICATION:{install_command:$INSTALL_CMD,typecheck: (if ($has_typecheck=="") then "NOT_CONFIGURED" else "RAN" end),build: "RAN",tests: (if ($has_test=="") then "NOT_CONFIGURED" else "RAN" end)},GIT:{branch: ("$(git rev-parse --abbrev-ref HEAD)"),commit: $commit_sha},BLOCKERS:[]}' > "$REPORT_JSON"

echo "[kernel-establish] finished. Report: $REPORT_JSON"

exit 0
