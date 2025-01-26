namespace ForestGenerator {
    export function generateSeagrass(x: number, y: number, z: number) {
        if (Math.random() < 0.5) {
            for (let i = 0; i <= randomInt(2, 6); i++) {

                if (World.getBlockID(x + i, y + 1, z + i) !== VanillaBlockID.dirt) continue;

                World.setBlock(x + i, y + 1, z + i, VanillaBlockID.seagrass, 0);
                World.setBlock(x + i, y + 1, z - i, VanillaBlockID.seagrass, 0);
                World.setBlock(x - i, y + 1, z + i, VanillaBlockID.seagrass, 0);
                World.setBlock(x - i, y + 1, z - i, VanillaBlockID.seagrass, 0);
            };
        };
    };
};