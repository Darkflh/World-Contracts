#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/run-integration-test.sh            # default delay
#   ./scripts/run-integration-test.sh 3          # 3s delay between commands
#   DELAY_SECONDS=1 ./scripts/run-integration-test.sh

DELAY_SECONDS="${DELAY_SECONDS:-${1:-2}}"

NETWORK="${SUI_NETWORK:-localnet}"
EXTRACTED_IDS_FILE="./deployments/${NETWORK}/extracted-object-ids.json"

has_builder_ids=false
if [[ -n "${BUILDER_PACKAGE_ID:-}" ]]; then
  has_builder_ids=true
elif [[ -f "${EXTRACTED_IDS_FILE}" ]] && grep -q '"builder"' "${EXTRACTED_IDS_FILE}" && grep -q '"packageId"' "${EXTRACTED_IDS_FILE}"; then
  has_builder_ids=true
fi

commands=(
  "create-character"
  "create-nwn"
  "deposit-fuel"
  "online-nwn"
  "create-storage-unit"
  "ssu-online"
  "game-item-to-chain"
  "withdraw-deposit"
  "chain-item-to-game"
  "create-gates"
  "online-gates"
  "link-gates"
  "jump"
  "deposit-to-ephemeral-inventory"
)

if [[ "${has_builder_ids}" == "true" ]]; then
  commands+=(
    "configure-builder-extension-rules"
    "authorise-gate"
    "authorise-storage-unit"
    "issue-tribe-jump-permit"
    "jump-with-permit"
    "collect-corpse-bounty"
  )
else
  echo "Builder extension IDs not found (BUILDER_PACKAGE_ID/env/extracted IDs)."
  echo "Skipping builder-extension integration steps."
fi

commands+=(
  "create-assembly"
  "online"
  "update-fuel"
  "anchor-turret"
  "online-turret"
  "get-priority-list"
)

if [[ "${has_builder_ids}" == "true" ]]; then
  commands+=("authorize-turret-extension")
fi

commands+=(
  "get-priority-list"
  "offline-nwn"
  "unanchor-nwn"
)

echo "Running ${#commands[@]} pnpm commands with ${DELAY_SECONDS}s delay..."

for i in "${!commands[@]}"; do
  step=$((i + 1))
  cmd="${commands[$i]}"

  echo
  echo "==> Step ${step}/${#commands[@]}: pnpm ${cmd}"
  pnpm "${cmd}"

  if [[ "${step}" -lt "${#commands[@]}" ]]; then
    sleep "${DELAY_SECONDS}"
  fi
done

echo
echo "Done."

