import "dotenv/config";
import { Transaction } from "@mysten/sui/transactions";
import { initializeContext, hydrateWorldConfig, requireEnv } from "./ts-scripts/utils/helper";
import { MODULES } from "./ts-scripts/utils/config";

async function setGateDistance() {
    const ctx = initializeContext("testnet", requireEnv("ADMIN_PRIVATE_KEY"));
    const { client, keypair } = ctx;
    const config = await hydrateWorldConfig(ctx);

    const packageId = config.packageId;
    const gateConfig = config.gateConfig;
    const adminAcl = config.adminAcl;

    // Gate type ID from test-resources.json
    const gateTypeId = 88086;
    const maxDistance = 10000000n; // 10M units

    console.log(`Setting max distance for gate type ${gateTypeId}...`);
    const tx = new Transaction();
    tx.moveCall({
        target: `${packageId}::${MODULES.GATE}::set_max_distance`,
        arguments: [
            tx.object(gateConfig),
            tx.object(adminAcl),
            tx.pure.u64(gateTypeId),
            tx.pure.u64(maxDistance),
        ],
    });

    const result = await client.signAndExecuteTransaction({
        signer: keypair,
        transaction: tx,
    });

    console.log("Digest:", result.digest);
    console.log("✓ Gate distance configured");
}

setGateDistance().catch(console.error);
