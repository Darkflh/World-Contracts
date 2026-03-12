import "dotenv/config";
import { initializeContext, hydrateWorldConfig, getEnvConfig } from "./ts-scripts/utils/helper";
import { deriveObjectId } from "./ts-scripts/utils/derive-object-id";
import { GAME_CHARACTER_ID, STORAGE_A_ITEM_ID, NWN_ITEM_ID } from "./ts-scripts/utils/constants";

async function findCharacterLocation() {
    try {
        const env = getEnvConfig();
        const ctx = initializeContext(env.network, env.adminExportedKey);
        await hydrateWorldConfig(ctx);

        const { config } = ctx;

        console.log("\n========== Character Location Info ==========\n");

        // Get character ID
        const characterId = deriveObjectId(
            config.objectRegistry,
            GAME_CHARACTER_ID,
            config.packageId
        );
        console.log("📍 Your Character ID:");
        console.log(`   ${characterId}`);

        // Get your assemblies (structures you own)
        const nwnId = deriveObjectId(config.objectRegistry, NWN_ITEM_ID, config.packageId);
        const storageId = deriveObjectId(config.objectRegistry, STORAGE_A_ITEM_ID, config.packageId);

        console.log("\n🏗️  Your Owned Structures:");
        console.log(`   Network Node: ${nwnId}`);
        console.log(`   Storage Unit: ${storageId}`);

        console.log("\n💡 Character locations in EVE Frontier are determined by:");
        console.log("   1. Where your Network Node is positioned (your base)");
        console.log("   2. Where your Storage Units are positioned");
        console.log("   3. Your current assembly/structure you're interacting with");

        console.log("\n🗺️  Location System:");
        console.log("   - Each structure has coordinates: (SolarSystem, X, Y, Z)");
        console.log("   - Locations must be 'revealed' (location::reveal_location)");
        console.log("   - Use LocationRegistry to query coordinates by structure ID");

        console.log("\n📡 To Query a Structure's Location:");
        console.log("   pnpm exec tsx get-location.ts <structure_id>");

        console.log("\n========================================\n");
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

findCharacterLocation();
