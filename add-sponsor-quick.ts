import "dotenv/config";
import { Transaction } from "@mysten/sui/transactions";
import { initializeContext, hydrateWorldConfig, requireEnv } from "./ts-scripts/utils/helper";
import { MODULES } from "./ts-scripts/utils/config";

async function addSponsor() {
    const network = "testnet" as const;
    const adminKey = requireEnv("ADMIN_PRIVATE_KEY");
    const sponsorAddress = requireEnv("SPONSOR_ADDRESSES");

    const ctx = initializeContext(network, adminKey);
    const { client, keypair } = ctx;
    const config = await hydrateWorldConfig(ctx);

    const packageId = config.packageId;
    const adminAcl = config.adminAcl;
    const governorCap = config.governorCap;

    console.log(`Adding sponsor ${sponsorAddress} to AdminACL...`);
    const tx = new Transaction();
    tx.moveCall({
        target: `${packageId}::${MODULES.ACCESS}::add_sponsor_to_acl`,
        arguments: [
            tx.object(adminAcl),
            tx.object(governorCap),
            tx.pure.address(sponsorAddress),
        ],
    });

    const result = await client.signAndExecuteTransaction({
        signer: keypair,
        transaction: tx,
        options: { showObjectChanges: true },
    });

    console.log("Digest:", result.digest);
    if (result.effects?.status?.status === "failure") {
        console.log("Status:", result.effects.status);
        throw new Error("add_sponsor_to_acl failed");
    }
    console.log("✓ Sponsor added successfully");
}

addSponsor().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
