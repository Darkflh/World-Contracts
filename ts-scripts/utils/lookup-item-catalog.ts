import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type CatalogEntry = {
    typeId: number;
    name: string;
    category: string;
    group: string;
    defaultVolume: number | null;
    datacoreItemId: string | null;
    itemIds: number[];
    sourceUrl: string;
};

type CatalogPayload = {
    entries: CatalogEntry[];
};

function getWorkspaceRoot(): string {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(dir, "../..");
}

function readCatalog(workspaceRoot: string): CatalogPayload {
    const filePath = path.resolve(workspaceRoot, "catalog", "item-catalog.json");
    if (!fs.existsSync(filePath)) {
        throw new Error(`Catalog not found: ${filePath}. Run 'pnpm build-item-catalog' first.`);
    }

    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw) as CatalogPayload;
    if (!Array.isArray(parsed.entries)) {
        throw new Error(`Invalid catalog format in ${filePath}`);
    }
    return parsed;
}

function usage(): never {
    console.error("Usage: pnpm lookup-item-catalog -- <query>");
    console.error("Examples:");
    console.error("  pnpm lookup-item-catalog -- assembler");
    console.error("  pnpm lookup-item-catalog -- 88068");
    console.error("  pnpm lookup-item-catalog -- 9999000006");
    process.exit(1);
}

function formatEntry(entry: CatalogEntry): string {
    return [
        `${entry.name} [typeId=${entry.typeId}]`,
        `  category=${entry.category} | group=${entry.group} | volume=${entry.defaultVolume ?? "n/a"}`,
        `  datacoreItemId=${entry.datacoreItemId ?? "n/a"}`,
        `  itemIds=${entry.itemIds.length > 0 ? entry.itemIds.join(",") : "none"}`,
        `  source=${entry.sourceUrl}`,
    ].join("\n");
}

function main() {
    const query = process.argv.slice(2).join(" ").trim();
    if (!query) usage();

    const workspaceRoot = getWorkspaceRoot();
    const catalog = readCatalog(workspaceRoot);
    const lowerQuery = query.toLowerCase();
    const numericQuery = Number(query);
    const isNumeric = Number.isFinite(numericQuery);

    const exactNameMatches = catalog.entries.filter((entry) => entry.name.toLowerCase() === lowerQuery);
    const typeIdMatches = isNumeric
        ? catalog.entries.filter((entry) => entry.typeId === numericQuery)
        : [];
    const itemIdMatches = isNumeric
        ? catalog.entries.filter(
              (entry) =>
                  entry.itemIds.includes(numericQuery) ||
                  (entry.datacoreItemId !== null && entry.datacoreItemId === query)
          )
        : [];
    const partialNameMatches = catalog.entries.filter((entry) =>
        entry.name.toLowerCase().includes(lowerQuery)
    );

    const merged = new Map<number, CatalogEntry>();
    for (const entry of [...exactNameMatches, ...typeIdMatches, ...itemIdMatches, ...partialNameMatches]) {
        merged.set(entry.typeId, entry);
    }

    const results = [...merged.values()];
    if (results.length === 0) {
        console.log(`No matches for '${query}'.`);
        process.exit(0);
    }

    const ranked = results.sort((a, b) => {
        const aExact = a.name.toLowerCase() === lowerQuery ? 0 : 1;
        const bExact = b.name.toLowerCase() === lowerQuery ? 0 : 1;
        if (aExact !== bExact) return aExact - bExact;
        return a.name.localeCompare(b.name);
    });

    console.log(`Matches: ${ranked.length}`);
    for (const entry of ranked.slice(0, 20)) {
        console.log(formatEntry(entry));
    }
    if (ranked.length > 20) {
        console.log(`...and ${ranked.length - 20} more.`);
    }
}

try {
    main();
} catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
}
