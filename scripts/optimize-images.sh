#!/usr/bin/env bash
set -euo pipefail

images_root="${1:-static/images}"
quality="${WEBP_QUALITY:-82}"

if [[ ! -d "$images_root" ]]; then
  echo "Image directory not found: $images_root"
  exit 1
fi

if ! command -v cwebp >/dev/null 2>&1; then
  echo "cwebp not found. Install it (for example: brew install webp) and rerun."
  exit 0
fi

converted=0
skipped=0

while IFS= read -r -d '' image; do
  output="${image%.*}.webp"

  if [[ -f "$output" && "$output" -nt "$image" ]]; then
    ((skipped+=1))
    continue
  fi

  cwebp -quiet -q "$quality" "$image" -o "$output"
  echo "optimized: $image -> $output"
  ((converted+=1))
done < <(find "$images_root" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0)

echo "Done. Converted: $converted, skipped (already up to date): $skipped"
