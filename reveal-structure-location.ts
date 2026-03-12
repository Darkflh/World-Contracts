import "dotenv/config";
import { Transaction } from "@mysten/sui/transactions";
import { MODULES } from "./ts-scripts/utils/config";
import {
    initializeContext,
    hydrateWorldConfig,
    getEnvConfig,
    requireEnv,
} from "./ts-scripts/utils/helper";
import { deriveObjectId } from "./ts-scripts/utils/derive-object-id";
import { STORAGE_A_ITEM_ID } from "./ts-scripts/utils/constants";
import { keypairFromPrivateKey } from "./ts-scripts/utils/client";
import { executeSponsoredTransaction } from "./ts-scripts/utils/transaction";

/**
 * Reveals a structure's location (makes coordinates public on-chain)
 * 
 * Usage:
 *   pnpm exec tsx reveal-structure-location.ts <solarsystem> <x> <y> <z>
 * 
 * Example:
 *   pnpm exec tsx reveal-structure-location.ts 1 "100" "200" "300"
 *   pnpm exec tsx reveal-structure-location.ts 1 "100.5" "-50.25" "300"
 */

async function revealStructureLocation() {
    try {
        const args = process.argv.slice(2);
        if (args.length < 4) {
            console.error("❌ Usage: pnpm exec tsx reveal-structure-location.ts <solarsystem> <x> <y> <z>");
            console.error("\n📍 Example:");
            console.error("   pnpm exec tsx reveal-structure-location.ts 1 \"100\" \"200\" \"300\"");
            console.error("   pnpm exec tsx reveal-structure-location.ts 1 \"100.5\" \"-50.25\" \"300\"");
            process.exit(1);
        }

        const solarsystem = BigInt(parseInt(args[0]));
        const xCoord = args[1];
        const yCoord = args[2];
        const zCoord = args[3];

        const env = getEnvConfig();
        const playerKey = requireEnv("PLAYER_A_PRIVATE_KEY");
        const playerCtx = initializeContext(env.network, playerKey);
        await hydrateWorldConfig(playerCtx);

        const { client, keypair: playerKeypair, config } = playerCtx;
        const adminKeypair = keypairFromPrivateKey(env.adminExportedKey);
        const adminAddress = adminKeypair.getPublicKey().toSuiAddress();

        if (!config.locationRegistry) {
            console.error("❌ LocationRegistry not found in configuration");
            process.exit(1);
        }

        const storageUnitId = deriveObjectId(
            config.objectRegistry,
            STORAGE_A_ITEM_ID,
            config.packageId
        );

        console.log("\n========== Revealing Structure Location ==========");
        console.log(`Storage Unit: ${storageUnitId}`);
        console.log(`Solar System: ${solarsystem}`);
        console.log(`Coordinates: X="${xCoord}", Y="${yCoord}", Z="${zCoord}"`);
        console.log("=================================================\n");

        const tx = new Transaction();
        tx.setSender(playerCtx.address);
        tx.setGasOwner(adminAddress);

        if (!config.locationRegistry) {
            throw new Error("Location registry not configured");
        }

        tx.moveCall({
            target: `${config.packageId}::${MODULES.STORAGE_UNIT}::reveal_location`,
            arguments: [
                tx.object(storageUnitId),
                tx.object(config.locationRegistry),
                tx.object(config.adminAcl),
                tx.pure.u64(solarsystem),
                tx.pure.string(xCoord),
                tx.pure.string(yCoord),
                tx.pure.string(zCoord),
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

        console.log("✅ Location revealed successfully!");
        console.log(`Transaction Digest: ${result.digest}`);
        console.log("\n📌 Your structure is now visible on the game map:");
        console.log(`   Solar System: ${solarsystem}`);
        console.log(`   Position: (${xCoord}, ${yCoord}, ${zCoord})`);
    } catch (error) {
        console.error("❌ Error revealing location:", error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

revealStructureLocation();
