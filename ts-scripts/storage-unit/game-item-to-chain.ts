import "dotenv/config";
import { Transaction } from "@mysten/sui/transactions";
import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { getConfig, MODULES } from "../utils/config";
import { deriveObjectId } from "../utils/derive-object-id";
import {
    hydrateWorldConfig,
    initializeContext,
    handleError,
    getEnvConfig,
    shareHydratedConfig,
    requireEnv,
} from "../utils/helper";
import { executeSponsoredTransaction } from "../utils/transaction";
import {
    GAME_CHARACTER_ID,
    STORAGE_A_ITEM_ID,
    ITEM_A_TYPE_ID,
    ITEM_A_ITEM_ID,
} from "../utils/constants";
import { getOwnerCap } from "./helper";

function envBigInt(name: string, fallback: bigint): bigint {
    const raw = process.env[name];
    if (!raw || raw.trim() === "") return fallback;
    return BigInt(raw.trim());
}

function envU64(name: string, fallback: bigint): bigint {
    const value = envBigInt(name, fallback);
    if (value < 0n) throw new Error(`${name} must be >= 0`);
    return value;
}

function envU32(name: string, fallback: number): number {
    const raw = process.env[name];
    if (!raw || raw.trim() === "") return fallback;
    const parsed = Number(raw.trim());
    if (!Number.isInteger(parsed) || parsed < 0 || parsed > 0xffffffff) {
        throw new Error(`${name} must be an integer between 0 and 4294967295`);
    }
    return parsed;
}

async function gameItemToChain(
    storageUnit: string,
    characterId: string,
    ownerCapId: string,
    playerAddress: string,
    typeId: bigint,
    itemId: bigint,
    volume: bigint,
    quantity: number,
    adminAddress: string,
    client: SuiJsonRpcClient,
    playerKeypair: Ed25519Keypair,
    adminKeypair: Ed25519Keypair,
    config: ReturnType<typeof getConfig>
) {
    console.log("\n==== Move Items from from game to Chain ====");

    const tx = new Transaction();
    tx.setSender(playerAddress);
    tx.setGasOwner(adminAddress);

    const [ownerCap, receipt] = tx.moveCall({
        target: `${config.packageId}::${MODULES.CHARACTER}::borrow_owner_cap`,
        typeArguments: [`${config.packageId}::${MODULES.STORAGE_UNIT}::StorageUnit`],
        arguments: [tx.object(characterId), tx.object(ownerCapId)],
    });

    tx.moveCall({
        target: `${config.packageId}::${MODULES.STORAGE_UNIT}::game_item_to_chain_inventory`,
        typeArguments: [`${config.packageId}::${MODULES.STORAGE_UNIT}::StorageUnit`],
        arguments: [
            tx.object(storageUnit),
            tx.object(config.adminAcl),
            tx.object(characterId),
            ownerCap,
            tx.pure.u64(itemId),
            tx.pure.u64(typeId),
            tx.pure.u64(volume),
            tx.pure.u32(quantity),
        ],
    });

    tx.moveCall({
        target: `${config.packageId}::${MODULES.CHARACTER}::return_owner_cap`,
        typeArguments: [`${config.packageId}::${MODULES.STORAGE_UNIT}::StorageUnit`],
        arguments: [tx.object(characterId), ownerCap, receipt],
    });

    const result = await executeSponsoredTransaction(
        tx,
        client,
        playerKeypair,
        adminKeypair,
        playerAddress,
        adminAddress,
        { showEvents: true }
    );

    console.log("Transaction digest:", result.digest);
    console.log("Item Id:", itemId);
}

async function main() {
    try {
        const env = getEnvConfig();
        const ctx = initializeContext(env.network, env.adminExportedKey);
        await hydrateWorldConfig(ctx);
        const playerKey = requireEnv("PLAYER_A_PRIVATE_KEY");
        const playerCtx = initializeContext(env.network, playerKey);
        shareHydratedConfig(ctx, playerCtx);
        const { client, keypair, config } = ctx;

        const playerAddress = playerCtx.address;
        const adminAddress = keypair.getPublicKey().toSuiAddress();

        const characterObject = deriveObjectId(
            config.objectRegistry,
            GAME_CHARACTER_ID,
            config.packageId
        );

        const storageUnit = deriveObjectId(
            config.objectRegistry,
            STORAGE_A_ITEM_ID,
            config.packageId
        );

        const storageUnitOwnerCap = await getOwnerCap(storageUnit, client, config, playerAddress);
        if (!storageUnitOwnerCap) {
            throw new Error(`OwnerCap not found for ${storageUnit}`);
        }

        const typeId = envU64("ITEM_TYPE_ID", ITEM_A_TYPE_ID);
        const itemId = envU64("ITEM_ITEM_ID", ITEM_A_ITEM_ID);
        const volume = envU64("ITEM_VOLUME", 10n);
        const quantity = envU32("ITEM_QUANTITY", 10);

        await gameItemToChain(
            storageUnit,
            characterObject,
            storageUnitOwnerCap,
            playerAddress,
            typeId,
            itemId,
            volume,
            quantity,
            adminAddress,
            client,
            playerCtx.keypair,
            keypair,
            config
        );
    } catch (error) {
        handleError(error);
    }
}

main();
