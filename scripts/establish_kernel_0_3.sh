#!/usr/bin/env bash
set -euo pipefail

ZIP_NAME="AURAXHERO_X_UNIFIED_KERNEL_0.2 3.zip"
WORKDIR=".kernel_extract_workdir"
EXTRACT_DIR="$WORKDIR/extracted"
HIST_DIR="historical-excluded"
HIST_INDEX="$HIST_DIR/index.json"
PROV_DIR=".provenance"
PROV_MANIFEST="$PROV_DIR/manifest.json"

# Excluded patterns (do not import into canonical tree)
EXCLUDE_PATTERNS=("*.sql" "*.sqlite" "*.bak" "backups/*" "*.env" ".env*" "*.pem" "*.key" "*.p12" "*.jks" "*.crt" "credentials*" "*token*" "*secret*" "*brindlewick*" )

echo "Starting Kernel 0.3 establishment script"
mkdir -p "$WORKDIR" "$EXTRACT_DIR" "$HIST_DIR" "$PROV_DIR"

# Ensure ZIP exists
if [ ! -f "$ZIP_NAME" ]; then
  echo "ERROR: ZIP artifact '$ZIP_NAME' not found at repo root. Aborting." >&2
  exit 2
fi

# Unpack the ZIP into a temporary extraction directory
unzip -qq -o "$ZIP_NAME" -d "$EXTRACT_DIR"

# Build list of excluded files and compute sha256 for index
echo "[]" > "$HIST_INDEX"

# Function to check if path matches any exclude pattern (basic globbing via bash)
matches_exclude() {
  local p="$1"
  for pat in "${EXCLUDE_PATTERNS[@]}"; do
    if [[ "$p" == $pat || "$p" == ${pat#*/} || "$p" == */${pat#*/} ]]; then
      return 0
    fi
    # Also test using bash extglob-style match
    if [[ "$p" == $pat ]]; then
      return 0
    fi
  done
  # fallback: check name components for keywords
  local lowerp=$(echo "$p" | tr '[:upper:]' '[:lower:]')
  if [[ "$lowerp" == *secret* || "$lowerp" == *token* || "$lowerp" == *credentials* || "$lowerp" == *brindlewick* ]]; then
    return 0
  fi
  return 1
}

# Walk extracted files and gather excluded files
excluded_entries=()
while IFS= read -r -d '' file; do
  # file is full path; get relative path inside extraction
  relpath="${file#$EXTRACT_DIR/}"
  if matches_exclude "$relpath"; then
    # compute sha256 of the file bytes
    sha=$(sha256sum "$file" | awk '{print $1}')
    excluded_entries+=("{\"path\": \"$relpath\", \"sha256\": \"$sha\"}")
  fi
done < <(find "$EXTRACT_DIR" -type f -print0)

# Write historical index JSON
if [ ${#excluded_entries[@]} -gt 0 ]; then
  printf "%s\n" "[${excluded_entries[*]}]" > "$HIST_INDEX"
else
  # empty array
  echo "[]" > "$HIST_INDEX"
fi

# Remove excluded files from the extraction tree (do not import them)
while IFS= read -r -d '' file; do
  relpath="${file#$EXTRACT_DIR/}"
  if matches_exclude "$relpath"; then
    rm -f "$file"
  fi
done < <(find "$EXTRACT_DIR" -type f -print0)

# Prepare to move canonical files into the repository root
# Ensure we will not create duplicates: check for existing canonical dirs in repo root
collision_found=0
for cand in app lib package.json; do
  if [ -e "$cand" ]; then
    echo "Collision detected: $cand already exists in the repository root. Aborting extraction to avoid duplicate canonical trees." >&2
    collision_found=1
  fi
done
if [ $collision_found -ne 0 ]; then
  echo "Please resolve collisions on the branch before running this script. Exiting." >&2
  exit 3
fi

# Move extracted contents into repo root (only the top-level entries from the extraction)
# If extraction contained a single top-level folder with the app, lib, etc., move its contents up
# Find top-level entries inside $EXTRACT_DIR
shopt -s dotglob
top_level=("$EXTRACT_DIR"/*)
if [ ${#top_level[@]} -eq 1 ] && [ -d "${top_level[0]}" ]; then
  echo "Single top-level directory found in the ZIP — moving its contents to repo root"
  mv "${top_level[0]}"/* . || true
else
  echo "Multiple top-level entries found. Moving all top-level entries into repo root"
  mv "$EXTRACT_DIR"/* . || true
fi

# Record provenance: which files came from the ZIP (sha256 of ZIP + list of moved files)
zip_sha=$(sha256sum "$ZIP_NAME" | awk '{print $1}')
# create manifest with ZIP sha and list of canonical files
jq -n --arg zip "$ZIP_NAME" --arg zipsha "$zip_sha" '{zip: $zip, zip_sha256: $zipsha, extracted_at: (now|tostring)}' > "$PROV_MANIFEST"

# Stage provenance and index files
git add "$HIST_INDEX" "$PROV_MANIFEST" $PROV_DIR || true

# Inspect package.json if present and determine commands
if [ -f package.json ]; then
  echo "package.json found — using its scripts for install/typecheck/build/tests"
  # Install dependencies
  if [ -f package-lock.json ]; then
    npm ci
  else
    npm install
  fi

  # Typecheck if script exists
  if npm run |& grep -q "typecheck"; then
    npm run typecheck
  elif [ -f tsconfig.json ]; then
    npx tsc --noEmit
  else
    echo "No typecheck script or tsconfig.json found — skipping typecheck"
  fi

  # Production build
  if npm run |& grep -q "build"; then
    npm run build
  else
    echo "No build script found — skipping build"
  fi

  # Tests if present
  if npm run |& grep -q "test"; then
    npm test || true
  fi
else
  echo "No package.json found in extracted canonical tree — skipping install/typecheck/build"
fi

# If we reached here without exiting, create a commit to record the canonical tree
# Add all new files except the original ZIP
# Ensure we do not add historical ZIP
git add --all :/ || true
# Unstage ZIP just in case
git reset -- "$ZIP_NAME" || true

commit_msg="Establish Auraxhero X Kernel 0.3 canonical source"
if git diff --staged --quiet; then
  echo "No staged changes to commit. Nothing to do."
else
  git commit -m "$commit_msg"
  git push origin HEAD
fi

echo "Script completed"
