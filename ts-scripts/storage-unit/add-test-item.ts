import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

type CatalogEntry = {
    typeId: number;
    name: string;
    defaultVolume: number | null;
    itemIds: number[];
};

type CatalogPayload = {
    entries: CatalogEntry[];
};

type CliOptions = {
    query: string;
    quantity: number;
    itemIdOverride?: bigint;
    volumeOverride?: bigint;
    dryRun: boolean;
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
    console.error("Usage: pnpm add-test-item -- <item name|typeId> [--qty <n>] [--item-id <u64>] [--volume <u64>] [--dry-run]");
    console.error("Examples:");
    console.error('  pnpm add-test-item -- "base autocannon" --qty 10 --item-id 1000004145107');
    console.error("  pnpm add-test-item -- 81974 --qty 5 --dry-run");
    process.exit(1);
}

function parseArgs(): CliOptions {
    const args = process.argv.slice(2);
    if (args.length === 0) usage();

    let query = "";
    let quantity = 10;
    let itemIdOverride: bigint | undefined;
    let volumeOverride: bigint | undefined;
    let dryRun = false;

    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];
        if (arg === "--qty") {
            const raw = args[index + 1];
            if (!raw) throw new Error("Missing value for --qty");
            const parsed = Number(raw);
            if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 0xffffffff) {
                throw new Error("--qty must be an integer between 1 and 4294967295");
            }
            quantity = parsed;
            index += 1;
            continue;
        }

        if (arg === "--item-id") {
            const raw = args[index + 1];
            if (!raw) throw new Error("Missing value for --item-id");
            itemIdOverride = BigInt(raw);
            if (itemIdOverride < 0n) throw new Error("--item-id must be >= 0");
            index += 1;
            continue;
        }

        if (arg === "--volume") {
            const raw = args[index + 1];
            if (!raw) throw new Error("Missing value for --volume");
            volumeOverride = BigInt(raw);
            if (volumeOverride < 0n) throw new Error("--volume must be >= 0");
            index += 1;
            continue;
        }

        if (arg === "--dry-run") {
            dryRun = true;
            continue;
        }

        if (arg.startsWith("--")) {
            throw new Error(`Unknown option: ${arg}`);
        }

        if (query.length > 0) {
            throw new Error("Provide a single item query (name or typeId)");
        }
        query = arg;
    }

    if (!query) usage();
    return { query, quantity, itemIdOverride, volumeOverride, dryRun };
}

function resolveEntry(catalog: CatalogPayload, query: string): CatalogEntry {
    const lower = query.toLowerCase();
    const numeric = Number(query);
    const isNumeric = Number.isFinite(numeric);

    const exactName = catalog.entries.filter((entry) => entry.name.toLowerCase() === lower);
    if (exactName.length === 1) return exactName[0];

    if (isNumeric) {
        const byType = catalog.entries.filter((entry) => entry.typeId === numeric);
        if (byType.length === 1) return byType[0];
    }

    const partial = catalog.entries.filter((entry) => entry.name.toLowerCase().includes(lower));
    if (partial.length === 1) return partial[0];
    if (partial.length > 1) {
        throw new Error(
            `Multiple matches for '${query}'. Try a more specific name or typeId. Candidates: ${partial
                .slice(0, 8)
                .map((entry) => `${entry.name} [${entry.typeId}]`)
                .join(", ")}${partial.length > 8 ? ", ..." : ""}`
        );
    }

    throw new Error(`No catalog match for '${query}'`);
}

function defaultItemId(entry: CatalogEntry): bigint {
    if (entry.itemIds.length > 0) return BigInt(entry.itemIds[0]);
    const timestamp = BigInt(Date.now());
    const typePart = BigInt(entry.typeId) * 1000000n;
    return typePart + (timestamp % 1000000n);
}

function defaultVolume(entry: CatalogEntry): bigint {
    if (entry.defaultVolume === null || entry.defaultVolume <= 0) return 1n;
    const asInt = Math.round(entry.defaultVolume);
    return BigInt(asInt > 0 ? asInt : 1);
}

function main() {
    const options = parseArgs();
    const workspaceRoot = getWorkspaceRoot();
    const catalog = readCatalog(workspaceRoot);
    const entry = resolveEntry(catalog, options.query);

    const typeId = BigInt(entry.typeId);
    const itemId = options.itemIdOverride ?? defaultItemId(entry);
    const volume = options.volumeOverride ?? defaultVolume(entry);

    console.log(`Resolved: ${entry.name} [typeId=${entry.typeId}]`);
    console.log(`Using itemId=${itemId.toString()} volume=${volume.toString()} quantity=${options.quantity}`);

    if (options.dryRun) {
        console.log("Dry run only. No transaction submitted.");
        return;
    }

    const child = spawnSync(
        process.platform === "win32" ? "pnpm.cmd" : "pnpm",
        ["game-item-to-chain"],
        {
            cwd: workspaceRoot,
            stdio: "inherit",
            env: {
                ...process.env,
                ITEM_TYPE_ID: typeId.toString(),
                ITEM_ITEM_ID: itemId.toString(),
                ITEM_VOLUME: volume.toString(),
                ITEM_QUANTITY: String(options.quantity),
            },
        }
    );

    if (typeof child.status === "number" && child.status !== 0) {
        process.exit(child.status);
    }

    if (child.error) {
        throw child.error;
    }
}

try {
    main();
} catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
}
