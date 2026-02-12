#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 --major | --minor | --patch"
  exit 1
}

# ── Parse args ──────────────────────────────────────────────
[[ $# -eq 0 ]] && usage

BUMP=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --major) BUMP="major"; shift ;;
    --minor) BUMP="minor"; shift ;;
    --patch) BUMP="patch"; shift ;;
    *) usage ;;
  esac
done
[[ -z "$BUMP" ]] && usage

# ── Preflight checks ───────────────────────────────────────
command -v gh >/dev/null 2>&1 || { echo "Error: gh CLI is not installed"; exit 1; }
command -v bun >/dev/null 2>&1 || { echo "Error: bun is not installed"; exit 1; }

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Error: working tree is dirty — commit or stash changes first"
  exit 1
fi

# ── Bump version ────────────────────────────────────────────
CURRENT=$(bun -e "console.log(require('./package.json').version)")
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"

case "$BUMP" in
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  patch) PATCH=$((PATCH + 1)) ;;
esac

VERSION="${MAJOR}.${MINOR}.${PATCH}"
TAG="v${VERSION}"

echo "Bumping $CURRENT -> $VERSION"

# Update package.json version in place
bun -e "
  const pkg = JSON.parse(require('fs').readFileSync('./package.json', 'utf-8'));
  pkg.version = '${VERSION}';
  require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# ── Build ───────────────────────────────────────────────────
echo "Building dist..."
bun run dist

# ── Commit, tag, push ──────────────────────────────────────
git add package.json
git commit -m "${TAG}"
git tag "$TAG"
git push origin HEAD "$TAG"

# ── Create GitHub release ──────────────────────────────────
echo "Creating release ${TAG}..."
gh release create "$TAG" dist/bpmacmods-darwin-universal.zip \
  --title "$TAG" \
  --generate-notes

echo "Released ${TAG}"
