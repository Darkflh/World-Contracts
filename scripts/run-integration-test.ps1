param(
    [int]$DelaySeconds = 2
)

$ErrorActionPreference = "Stop"

$network = if ($env:SUI_NETWORK) { $env:SUI_NETWORK } else { "localnet" }
$extractedIdsFile = Join-Path "." "deployments/$network/extracted-object-ids.json"

$hasBuilderIds = $false
if ($env:BUILDER_PACKAGE_ID -and $env:BUILDER_PACKAGE_ID.Trim().Length -gt 0) {
    $hasBuilderIds = $true
} elseif (Test-Path $extractedIdsFile) {
    try {
        $json = Get-Content -Path $extractedIdsFile -Raw | ConvertFrom-Json
        if ($null -ne $json.builder -and $null -ne $json.builder.packageId -and $json.builder.packageId.ToString().Trim().Length -gt 0) {
            $hasBuilderIds = $true
        }
    } catch {
        $hasBuilderIds = $false
    }
}

$commands = @(
    "create-character",
    "create-nwn",
    "deposit-fuel",
    "online-nwn",
    "create-storage-unit",
    "ssu-online",
    "game-item-to-chain",
    "withdraw-deposit",
    "chain-item-to-game",
    "create-gates",
    "online-gates",
    "link-gates",
    "jump",
    "deposit-to-ephemeral-inventory"
)

if ($hasBuilderIds) {
    $commands += @(
        "configure-builder-extension-rules",
        "authorise-gate",
        "authorise-storage-unit",
        "issue-tribe-jump-permit",
        "jump-with-permit",
        "collect-corpse-bounty"
    )
} else {
    Write-Host "Builder extension IDs not found (BUILDER_PACKAGE_ID/env/extracted IDs)."
    Write-Host "Skipping builder-extension integration steps."
}

$commands += @(
    "create-assembly",
    "online",
    "update-fuel",
    "anchor-turret",
    "online-turret",
    "get-priority-list"
)

if ($hasBuilderIds) {
    $commands += "authorize-turret-extension"
}

$commands += @(
    "get-priority-list",
    "offline-nwn",
    "unanchor-nwn"
)

Write-Host "Running $($commands.Count) pnpm commands with ${DelaySeconds}s delay..."

for ($index = 0; $index -lt $commands.Count; $index++) {
    $step = $index + 1
    $cmd = $commands[$index]

    Write-Host ""
    Write-Host "==> Step $step/$($commands.Count): pnpm $cmd"

    & pnpm $cmd
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed: pnpm $cmd"
    }

    if ($step -lt $commands.Count -and $DelaySeconds -gt 0) {
        Start-Sleep -Seconds $DelaySeconds
    }
}

Write-Host ""
Write-Host "Done."
