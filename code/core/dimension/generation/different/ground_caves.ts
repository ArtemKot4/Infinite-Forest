namespace ForestGenerator {
    export const groundCaveBlockList = {
        pack_1: [VanillaBlockID.cobblestone, VanillaBlockID.gravel, VanillaBlockID.mossy_cobblestone],
        pack_2: [VanillaBlockID.lapis_ore, VanillaBlockID.coal_ore, VanillaBlockID.air, VanillaBlockID.dirt, VanillaBlockID.red_sandstone],
    };

    export function generateGroundCaves(chunkX: number, chunkZ: number) {
        const randomBlock1 = MathHelper.randomFromArray(groundCaveBlockList.pack_1);
        const randomBlock2 = MathHelper.randomFromArray(groundCaveBlockList.pack_2);

        for (let i = 0; i < 128; i++) {

            let coords = GenerationUtils.randomCoords(chunkX, chunkZ);
            coords = GenerationUtils.findSurface(coords.x, 127, coords.z);

            if (coords.y >= 45 && World.getBlockID(coords.x, coords.y, coords.z) === VanillaBlockID.stone) {

                if (Math.random() < 0.5) {
                    World.setBlock(coords.x, coords.y, coords.z, randomBlock1, 0);
                } else {

                    World.setBlock(coords.x, coords.y, coords.z, randomBlock2, 0);

                    if (randomBlock2 === VanillaBlockID.red_sandstone) {
                        if (Math.random() < 0.6) {
                            //! нужно дописать - Vine.generateOn(randomInt(3, 24), coords, FLAME_VINE);
                            return;
                        };
                    };
                };
            };
        };
    };
};