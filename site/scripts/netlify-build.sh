#!/usr/bin/env bash
# Netlify build: publish the existing static pages plus the new React
# homepage. Run from the repository root (Netlify does this automatically).
#
#   _site/            <- what Netlify publishes
#     projects.html, booklog.html, assets/, projects/, writings/ ...  (existing pages)
#     index.html, assets/<hashed files>                              (React homepage)
set -euo pipefail

OUT=_site
rm -rf "$OUT"
mkdir -p "$OUT"

# 1. Copy the existing static site (everything except source/tooling folders).
tar \
  --exclude='./site' \
  --exclude='./_site' \
  --exclude='./.git' \
  --exclude='./.github' \
  --exclude='./.claude' \
  --exclude='./.mcp.json' \
  --exclude='./netlify.toml' \
  --exclude='node_modules' \
  --exclude='.DS_Store' \
  -cf - . | tar -xf - -C "$OUT"

# 2. Build the React homepage.
(cd site && npm ci --no-audit --no-fund && npm run build)

# 3. Lay it over the static site. index.html is replaced by the new
#    homepage; its hashed files join the existing assets/ folder.
cp -R site/dist/. "$OUT/"

echo "Published files in $OUT:"
ls "$OUT"
