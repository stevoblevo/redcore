#!/usr/bin/env bash
# Grok-bot trigger for tower GTX 1060 Job B-1060.
# Do NOT point this at cuda/mumax/brickmark_pack.mx3.
set -euo pipefail

ROOT="${REDCORE_ROOT:-/boot/saelion/mumax}"
REPO="${REDCORE_REPO:-$ROOT/redcore}"
DECK="${REPO}/cuda/mumax/brickmark_pack_1060.mx3"
OUT="${ROOT}/brickmark_pack_1060.out"
MUMAX3="${MUMAX3:-mumax3}"

if [[ ! -f "$DECK" ]]; then
  echo "missing deck $DECK — clone stevoblevo/redcore next to this script" >&2
  exit 2
fi

if command -v nvidia-smi >/dev/null; then
  UTIL=$(nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits | head -1 | tr -d ' ')
  FREE=$(nvidia-smi --query-gpu=memory.free --format=csv,noheader,nounits | head -1 | tr -d ' ')
  NAME=$(nvidia-smi --query-gpu=name --format=csv,noheader | head -1)
  echo "gpu=$NAME util=${UTIL}% free_MiB=$FREE"
  if [[ "${UTIL:-0}" -ge 40 ]]; then
    echo "GPU busy (>=40%). refuse." >&2
    exit 3
  fi
  if [[ "${FREE:-0}" -lt 1500 ]]; then
    echo "free VRAM < 1500 MiB. refuse." >&2
    exit 4
  fi
fi

cd "$ROOT"
echo "vet $DECK"
"$MUMAX3" -vet -http= "$DECK"
echo "run $DECK"
START=$(date -u +%s)
"$MUMAX3" -http= "$DECK"
END=$(date -u +%s)
echo "wall_s=$((END-START))"
echo "out=$OUT"
echo "paste mx/mz/E and sha256 of the mx3 on https://github.com/stevoblevo/redcore/issues/1"
