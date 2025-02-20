namespace ForestGenerator {
    export const underwaterBlockList = [VanillaBlockID.gravel, VanillaBlockID.sand, VanillaBlockID.clay, VanillaBlockID.dirt];
    export function generateLakeBottom(chunkX: number, chunkZ: number) {
        const randomBlock1 = MathHelper.randomFromArray(underwaterBlockList);
        const randomBlock2 = MathHelper.randomFromArray(underwaterBlockList);

        for (let i = 0; i <= 512; i++) {

            let coords = GenerationUtils.randomCoords(chunkX, chunkZ);
            coords = GenerationUtils.findSurface(coords.x, 127, coords.z);

            if (coords.y <= WATER_LEVEL && World.getBlockID(coords.x, coords.y, coords.z) === VanillaBlockID.grass) {
                if (Math.random() < 0.94) {

                    World.setBlock(coords.x, coords.y, coords.z, randomBlock1, 0);

                    if (randomBlock1 === VanillaBlockID.dirt && Math.random() < 0.1) {
                        let heightMax = 53 - coords.y;
                        generateKelps(coords.x, coords.y, coords.z, MathHelper.randomInt(1, heightMax));
                    };

                } else {
                    World.setBlock(coords.x, coords.y, coords.z, randomBlock2, 0);
                };
            };
        };
    };
};