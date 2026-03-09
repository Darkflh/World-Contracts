import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type TestResources = {
    networkNode?: { typeId?: number; itemId?: number };
    assembly?: { typeId?: number; itemId?: number };
    assemblies?: Array<{ typeId?: number; itemId?: number }>;
    storageUnit?: { typeId?: number; itemId?: number };
    gate?: { typeId?: number; itemId1?: number; itemId2?: number };
    turret?: { typeId?: number; itemId?: number };
    item?: { typeId?: number; itemId?: number };
};

type Seed = {
    typeId: number;
    itemIds: number[];
};

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

function getWorkspaceRoot(): string {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(dir, "../..");
}

function readTestResources(workspaceRoot: string): TestResources {
    const filePath = path.resolve(workspaceRoot, "test-resources.json");
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as TestResources;
}

function addSeed(map: Map<number, Set<number>>, typeId?: number, ...itemIds: Array<number | undefined>) {
    if (!typeId || typeId <= 0) return;
    if (!map.has(typeId)) map.set(typeId, new Set<number>());
    const bucket = map.get(typeId)!;
    for (const itemId of itemIds) {
        if (itemId && itemId > 0) bucket.add(itemId);
    }
}

function collectSeeds(resources: TestResources): Seed[] {
    const byType = new Map<number, Set<number>>();

    addSeed(byType, resources.networkNode?.typeId, resources.networkNode?.itemId);
    addSeed(byType, resources.assembly?.typeId, resources.assembly?.itemId);
    for (const assembly of resources.assemblies ?? []) {
        addSeed(byType, assembly.typeId, assembly.itemId);
    }
    addSeed(byType, resources.storageUnit?.typeId, resources.storageUnit?.itemId);
    addSeed(byType, resources.gate?.typeId, resources.gate?.itemId1, resources.gate?.itemId2);
    addSeed(byType, resources.turret?.typeId, resources.turret?.itemId);
    addSeed(byType, resources.item?.typeId, resources.item?.itemId);

    const extraIds = (process.env.TYPE_IDS ?? "")
        .split(",")
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isFinite(value) && value > 0);

    for (const typeId of extraIds) {
        addSeed(byType, typeId);
    }

    return [...byType.entries()]
        .map(([typeId, itemIds]) => ({ typeId, itemIds: [...itemIds].sort((a, b) => a - b) }))
        .sort((a, b) => a.typeId - b.typeId);
}

function parseField(html: string, label: string): string | null {
    const regex = new RegExp(`\\b${label}:\\s*([^\\n\\r<]+)`, "i");
    const match = html.match(regex);
    return match?.[1]?.trim() ?? null;
}

function parseName(html: string, fallbackTypeId: number): string {
    const heading = html.match(/##\s+(.+?)\s+\[(\d+)\]/);
    if (heading?.[1]) return heading[1].trim();
    return `Unknown Type ${fallbackTypeId}`;
}

async function fetchCatalogEntry(baseUrl: string, seed: Seed): Promise<CatalogEntry> {
    const sourceUrl = `${baseUrl.replace(/\/$/, "")}/explore/types/${seed.typeId}`;
    const response = await fetch(sourceUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${sourceUrl}: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const name = parseName(html, seed.typeId);
    const category = parseField(html, "categoryName") ?? "Unknown";
    const group = parseField(html, "groupName") ?? "Unknown";
    const volumeRaw = parseField(html, "volume");
    const datacoreItemId = parseField(html, "itemId");

    return {
        typeId: seed.typeId,
        name,
        category,
        group,
        defaultVolume: volumeRaw ? Number(volumeRaw) : null,
        datacoreItemId,
        itemIds: seed.itemIds,
        sourceUrl,
    };
}

async function main() {
    const workspaceRoot = getWorkspaceRoot();
    const resources = readTestResources(workspaceRoot);
    const seeds = collectSeeds(resources);
    const baseUrl = process.env.DATACORE_BASE_URL ?? "https://evedataco.re";

    if (seeds.length === 0) {
        throw new Error("No typeIds found in test-resources.json and TYPE_IDS was empty.");
    }

    const outputPath = path.resolve(workspaceRoot, "catalog", "item-catalog.json");
    const entries: CatalogEntry[] = [];
    const failures: Array<{ typeId: number; error: string }> = [];

    for (const seed of seeds) {
        try {
            const entry = await fetchCatalogEntry(baseUrl, seed);
            entries.push(entry);
        } catch (error) {
            failures.push({
                typeId: seed.typeId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }

    const payload = {
        generatedAt: new Date().toISOString(),
        source: {
            baseUrl,
            note: "Off-chain reference data generated from Datacore type pages.",
        },
        summary: {
            requestedTypes: seeds.length,
            resolvedTypes: entries.length,
            failedTypes: failures.length,
        },
        entries,
        failures,
    };

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));

    console.log(`Catalog written to: ${outputPath}`);
    console.log(`Resolved: ${entries.length} | Failed: ${failures.length}`);
    if (failures.length > 0) {
        console.log("Failed typeIds:", failures.map((failure) => failure.typeId).join(", "));
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
