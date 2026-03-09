# TS Scripts

## Build off-chain item catalog from Datacore

Generates a local quick-reference catalog for `typeId -> {name, category, group, volume, itemIds}`.

- Source of truth: Datacore web pages (`/explore/types/<typeId>`)
- Output file: `catalog/item-catalog.json`
- Base input IDs: extracted from `test-resources.json`
- Optional extra IDs: `TYPE_IDS=82681,446,...`

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
```

### Notes

- This is off-chain reference data for scripts/UI.
- On-chain logic should continue to use `typeId` / `itemId` directly.
