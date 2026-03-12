import "dotenv/config";
import { initializeContext, hydrateWorldConfig, getEnvConfig } from "./ts-scripts/utils/helper";
import { deriveObjectId } from "./ts-scripts/utils/derive-object-id";
import { getFuelQuantity, isNetworkNodeOnline } from "./ts-scripts/network-node/helper";
import { NWN_ITEM_ID } from "./ts-scripts/utils/constants";

async function checkNetworkNodeFuel() {
    try {
        const env = getEnvConfig();
        const ctx = initializeContext(env.network, env.adminExportedKey);
        await hydrateWorldConfig(ctx);
        
        const { client, config } = ctx;
        const networkNodeId = deriveObjectId(
            config.objectRegistry,
            NWN_ITEM_ID,
            config.packageId
        );

        console.log("Network Node ID:", networkNodeId);
        
        const fuelQuantity = await getFuelQuantity(networkNodeId, client, config);
        const isOnline = await isNetworkNodeOnline(networkNodeId, client, config);

        console.log("\n========== Network Node Fuel Status ==========");
        console.log(`Fuel Quantity: ${fuelQuantity || "0"}`);
        console.log(`Is Online: ${isOnline}`);
        console.log("============================================\n");

        if (!fuelQuantity || fuelQuantity === 0n) {
            console.log("❌ Network node has NO fuel");
        } else {
            console.log(`✅ Network node has ${fuelQuantity} units of fuel`);
        }
    } catch (error) {
        console.error("Error checking network node fuel:", error);
        process.exit(1);
    }
}

checkNetworkNodeFuel();
