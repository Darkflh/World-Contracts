import "dotenv/config";
import { getConfig } from "./ts-scripts/utils/config";
import { initializeContext } from "./ts-scripts/utils/helper";

/**
 * Find the LocationRegistry object ID on-chain
 */
async function findLocationRegistry() {
    try {
        const config = getConfig("testnet");
        const packageId = config.packageId;

        if (!packageId) {
            console.error("❌ WORLD_PACKAGE_ID not set in .env");
            process.exit(1);
        }

        console.log(`📦 Package ID: ${packageId}`);
        console.log(`🔍 Looking for LocationRegistry in package...`);
        console.log(`\n   Type: ${packageId}::location::LocationRegistry`);
        console.log("\n💡 You can find this object ID by:");
        console.log("   1. Querying the published package with Sui CLI:");
        console.log(`      sui client objects --json | grep -i location`);
        console.log(`\n   2. Or checking the deployment transaction digest`);
        console.log(`\n   3. Using provided LocationRegistry in the command:`)
        console.log(`      pnpm exec tsx reveal-structure-location.ts 1 "100" "200" "300" <locationRegistryId>`);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

findLocationRegistry();
