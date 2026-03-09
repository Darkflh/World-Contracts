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

## Smooth add-to-test-server flow

Use this flow to add any item to test server storage without editing script constants.

```bash
# 1) Find IDs by name
pnpm lookup-item-catalog -- "base autocannon"

# 2) Push game item -> chain with per-run overrides
ITEM_TYPE_ID=81974 \
ITEM_ITEM_ID=1000004145107 \
ITEM_VOLUME=100 \
ITEM_QUANTITY=10 \
pnpm game-item-to-chain
```

Supported runtime overrides for `pnpm game-item-to-chain`:

- `ITEM_TYPE_ID` (u64)
- `ITEM_ITEM_ID` (u64)
- `ITEM_VOLUME` (u64)
- `ITEM_QUANTITY` (u32)

### One-command wrapper

```bash
# Resolve by name and send transaction
pnpm add-test-item -- "base autocannon" --qty 10 --item-id 1000004145107

# Resolve by typeId and preview only
pnpm add-test-item -- 81974 --qty 5 --dry-run
```

Options:

- `--qty <n>` default: `10`
- `--item-id <u64>` optional (auto-generated if omitted)
- `--volume <u64>` optional (defaults from catalog)
- `--dry-run` prints resolved values without submitting a transaction
