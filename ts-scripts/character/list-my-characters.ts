import "dotenv/config";
import {
    initializeContext,
    handleError,
    getEnvConfig,
    hydrateWorldConfig,
} from "../utils/helper";

async function listCharacters() {
    try {
        const env = getEnvConfig();
        const ctx = initializeContext(env.network, env.adminExportedKey);
        await hydrateWorldConfig(ctx);

        const { client, keypair, config } = ctx;
        const userAddress = keypair.getPublicKey().toSuiAddress();
        console.log(`\n==== Listing characters owned by ${userAddress} ====\n`);

        // Query for Character objects owned by this address
        const characters = await client.getOwnedObjects({
            owner: userAddress,
            filter: {
                StructType: `${config.packageId}::character::Character`,
            },
            options: {
                showType: true,
                showContent: true,
            },
        });

        if (!characters.data || characters.data.length === 0) {
            console.log("No characters found. Create one with:");
            console.log("pnpm create-character");
            return;
        }

        console.log(`Found ${characters.data.length} character(s):\n`);
        
        for (const obj of characters.data) {
            console.log(`Character ID: ${obj.data?.objectId}`);
            console.log(`Type: ${obj.data?.type}`);
            if ((obj.data?.content as any)?.fields) {
                const fields = (obj.data.content as any).fields;
                console.log(`Key: ${fields.key}`);
                console.log(`Tribe: ${fields.tribe_id}`);
                console.log(`Address: ${fields.character_address}`);
            }
            console.log(`---`);
        }
    } catch (error) {
        handleError("Error listing characters", error);
    }
}

listCharacters();
