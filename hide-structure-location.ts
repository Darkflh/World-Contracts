import "dotenv/config";
import { Transaction } from "@mysten/sui/transactions";
import { MODULES } from "./ts-scripts/utils/config";
import {
    initializeContext,
    hydrateWorldConfig,
    getEnvConfig,
    requireEnv,
    hexToBytes,
} from "./ts-scripts/utils/helper";
import { deriveObjectId } from "./ts-scripts/utils/derive-object-id";
import { STORAGE_A_ITEM_ID } from "./ts-scripts/utils/constants";
import { keypairFromPrivateKey } from "./ts-scripts/utils/client";
import { executeSponsoredTransaction } from "./ts-scripts/utils/transaction";

/**
 * Hides a structure's location by updating to a new private location hash
 * 
 * Usage:
 *   pnpm exec tsx hide-structure-location.ts [newLocationHash]
 * 
 * Example:
 *   pnpm exec tsx hide-structure-location.ts
 *   (generates random hash)
 * 
 *   pnpm exec tsx hide-structure-location.ts 0x0000000000000000000000000000000000000000000000000000000000000000
 *   (use specific hash)
 */

function generateRandomLocationHash(): string {
    // Generate a random 32-byte (256-bit) hash
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return "0x" + Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function hideStructureLocation() {
    try {
        const args = process.argv.slice(2);
        let newLocationHash = args[0];

        // If no hash provided, generate a random one
        if (!newLocationHash) {
            newLocationHash = generateRandomLocationHash();
            console.log("🔒 Generated random private hash:", newLocationHash);
        }

        // Validate hash format
        if (!newLocationHash.startsWith("0x") || newLocationHash.length !== 66) {
            console.error("❌ Invalid location hash format");
            console.error("   Hash must be 32 bytes (64 hex characters) with 0x prefix");
            console.error("   Format: 0x0000000000000000000000000000000000000000000000000000000000000000");
            process.exit(1);
        }

        const env = getEnvConfig();
        const playerKey = requireEnv("PLAYER_A_PRIVATE_KEY");
        const playerCtx = initializeContext(env.network, playerKey);
        await hydrateWorldConfig(playerCtx);

        const { client, keypair: playerKeypair, config } = playerCtx;
        const adminKeypair = keypairFromPrivateKey(env.adminExportedKey);
        const adminAddress = adminKeypair.getPublicKey().toSuiAddress();

        const storageUnitId = deriveObjectId(
            config.objectRegistry,
            STORAGE_A_ITEM_ID,
            config.packageId
        );

        console.log("\n========== Hiding Structure Location ==========");
        console.log(`Storage Unit: ${storageUnitId}`);
        console.log(`New Private Hash: ${newLocationHash}`);
        console.log("==============================================\n");

        const tx = new Transaction();
        tx.setSender(playerCtx.address);
        tx.setGasOwner(adminAddress);

        tx.moveCall({
            target: `${config.packageId}::${MODULES.LOCATION}::update`,
            arguments: [
                tx.object(storageUnitId),
                tx.object(config.adminAcl),
                tx.pure(hexToBytes(newLocationHash)),
            ],
        });

        const result = await executeSponsoredTransaction(
            tx,
            client,
            playerKeypair,
            adminKeypair,
            playerCtx.address,
            adminAddress
        );

        console.log("✅ Location hidden successfully!");
        console.log(`Transaction Digest: ${result.digest}`);
        console.log("\n🔒 Your structure location is now private:");
        console.log(`   New hash: ${newLocationHash}`);
        console.log("\n💡 Coordinates are no longer discoverable on-chain");
        console.log("   (though they remain in the LocationRegistry with the old hash)");
    } catch (error) {
        console.error("❌ Error hiding location:", error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

hideStructureLocation();
