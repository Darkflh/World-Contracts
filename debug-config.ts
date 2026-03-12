import "dotenv/config";
import { initializeContext, hydrateWorldConfig, requireEnv } from "./ts-scripts/utils/helper";

async function debug() {
    const network = "testnet" as const;
    const adminKey = requireEnv("ADMIN_PRIVATE_KEY");

    const ctx = initializeContext(network, adminKey);
    const config = await hydrateWorldConfig(ctx);
    const { client } = ctx;

    console.log("\n=== World Config ===");
    console.log("Package ID:", config.packageId);
    console.log("AdminACL ID:", config.adminAcl);
    console.log("Governor Cap:", config.governorCap);
    console.log("Object Registry:", config.objectRegistry);

    // Try to fetch the AdminACL object
    try {
        const adminAclObject = await client.getObject({
            id: config.adminAcl,
            options: { showContent: true },
        });
        console.log("\n=== AdminACL Object ===");
        console.log(JSON.stringify(adminAclObject, null, 2));
    } catch (e) {
        console.log("Error fetching AdminACL:", (e as Error).message);
    }
}

debug().catch(console.error);
