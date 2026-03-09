# TS Scripts

## Build off-chain item catalog from Datacore

Generates a local quick-reference catalog for `typeId -> {name, category, group, volume, itemIds}`.

- Source of truth: Datacore stillness API (`/api-stillness/types`)
- Output file: `catalog/item-catalog.json`
- Base input IDs: extracted from `test-resources.json`
- Optional extra IDs: `TYPE_IDS=82681,446,...`
- Catalog scope: `CATALOG_SCOPE=all` (default) or `CATALOG_SCOPE=seed`

### Run

```bash
pnpm build-item-catalog
```

Optional:

```bash
# Add extra type IDs
TYPE_IDS=82681,88068 pnpm build-item-catalog

# Use custom Datacore host
DATACORE_BASE_URL=https://evedataco.re pnpm build-item-catalog

# Build only from test-resources + TYPE_IDS (old behavior)
CATALOG_SCOPE=seed pnpm build-item-catalog
```

### Notes

- This is off-chain reference data for scripts/UI.
- On-chain logic should continue to use `typeId` / `itemId` directly.
- GitHub Actions workflow `.github/workflows/refresh-item-catalog.yml` refreshes this weekly and can be run manually.

## Lookup typeId/itemId by name

Use this when you mention an item name and want quick ID resolution.

```bash
# Lookup by item name
pnpm lookup-item-catalog -- assembler

# Lookup by typeId
pnpm lookup-item-catalog -- 88068

# Lookup by itemId or datacore itemId
pnpm lookup-item-catalog -- 9999000006
```
