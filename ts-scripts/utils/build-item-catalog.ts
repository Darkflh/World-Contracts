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

type DatacoreTypeAttribute = {
    trait_type?: string;
    value?: string | number;
};

type DatacoreTypeRecord = {
    smartItemId?: string;
    name?: string;
    attributes?: DatacoreTypeAttribute[];
};

type DatacoreTypesResponse = Record<string, DatacoreTypeRecord>;

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

function collectSeedMap(resources: TestResources): Map<number, Set<number>> {
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

    return byType;
}

function getAttributeValue(attributes: DatacoreTypeAttribute[] | undefined, key: string): string | number | null {
    if (!attributes?.length) return null;
    const match = attributes.find((attribute) => attribute.trait_type?.toLowerCase() === key.toLowerCase());
    return match?.value ?? null;
}

async function fetchAllTypes(baseUrl: string): Promise<DatacoreTypesResponse> {
    const sourceUrl = `${baseUrl.replace(/\/$/, "")}/api-stillness/types`;
    const response = await fetch(sourceUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${sourceUrl}: ${response.status} ${response.statusText}`);
    }

    const body = (await response.json()) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw new Error(`Unexpected payload from ${sourceUrl}`);
    }

    return body as DatacoreTypesResponse;
}

async function main() {
    const workspaceRoot = getWorkspaceRoot();
    const resources = readTestResources(workspaceRoot);
    const seedMap = collectSeedMap(resources);
    const seeds = [...seedMap.entries()]
        .map(([typeId, itemIds]) => ({ typeId, itemIds: [...itemIds].sort((a, b) => a - b) }))
        .sort((a, b) => a.typeId - b.typeId);
    const baseUrl = process.env.DATACORE_BASE_URL ?? "https://evedataco.re";
    const scope = (process.env.CATALOG_SCOPE ?? "all").toLowerCase();

    if (scope !== "all" && scope !== "seed") {
        throw new Error(`Invalid CATALOG_SCOPE: ${scope}. Expected 'all' or 'seed'.`);
    }

    if (scope === "seed" && seeds.length === 0) {
        throw new Error("No typeIds found in test-resources.json and TYPE_IDS was empty.");
    }

    const datacoreTypes = await fetchAllTypes(baseUrl);
    const targetTypeIds = scope === "all"
        ? Object.keys(datacoreTypes)
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value) && value > 0)
            .sort((a, b) => a - b)
        : seeds.map((seed) => seed.typeId);

    const outputPath = path.resolve(workspaceRoot, "catalog", "item-catalog.json");
    const entries: CatalogEntry[] = [];
    const failures: Array<{ typeId: number; error: string }> = [];

    for (const typeId of targetTypeIds) {
        try {
            const typeData = datacoreTypes[String(typeId)];
            if (!typeData) {
                throw new Error(`Type ${typeId} not found in /api-stillness/types payload`);
            }

            const category = getAttributeValue(typeData.attributes, "categoryName");
            const group = getAttributeValue(typeData.attributes, "groupName");
            const volume = getAttributeValue(typeData.attributes, "volume");
            const seedItemIds = seedMap.get(typeId);

            const entry: CatalogEntry = {
                typeId,
                name: typeData.name?.trim() || `Unknown Type ${typeId}`,
                category: typeof category === "string" && category.trim() ? category.trim() : "Unknown",
                group: typeof group === "string" && group.trim() ? group.trim() : "Unknown",
                defaultVolume: typeof volume === "number" ? volume : volume ? Number(volume) : null,
                datacoreItemId: typeData.smartItemId ?? null,
                itemIds: seedItemIds ? [...seedItemIds].sort((a, b) => a - b) : [],
                sourceUrl: `${baseUrl.replace(/\/$/, "")}/explore/types/${typeId}`,
            };

            entries.push(entry);
        } catch (error) {
            failures.push({
                typeId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }

    const payload = {
        generatedAt: new Date().toISOString(),
        source: {
            baseUrl,
            note: "Off-chain reference data generated from Datacore /api-stillness/types.",
            scope,
        },
        summary: {
            requestedTypes: targetTypeIds.length,
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
