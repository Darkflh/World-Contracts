import "dotenv/config";
import {
    initializeContext,
    handleError,
    getEnvConfig,
    hydrateWorldConfig,
} from "../utils/helper";

async function getCharacter(characterId: string) {
    try {
        const env = getEnvConfig();
        const ctx = initializeContext(env.network, env.adminExportedKey);
        await hydrateWorldConfig(ctx);

        const { client } = ctx;
        console.log(`\n==== Fetching character ${characterId} ====\n`);

        const character = await client.getObject({
            id: characterId,
            options: {
                showType: true,
                showContent: true,
            },
        });

        if (!character.data) {
            console.log("Character not found");
            return;
        }

        console.log(`Character ID: ${character.data.objectId}`);
        console.log(`Type: ${character.data.type}`);
        console.log(`Owner: ${JSON.stringify(character.data.owner)}`);
        
        if ((character.data.content as any)?.fields) {
            const fields = (character.data.content as any).fields;
            console.log(`\nFields:`);
            console.log(`  Key: ${fields.key}`);
            console.log(`  Tribe ID: ${fields.tribe_id}`);
            console.log(`  Character Address: ${fields.character_address}`);
        }
    } catch (error) {
        handleError(error);
    }
}

const characterId = process.argv[2] || "0xb39d210342a628984c32a8f839c515ed3020feac582e690715f7514a6179b2b9";
getCharacter(characterId);
