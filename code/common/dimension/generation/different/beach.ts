namespace ForestGenerator {    
    export const WATER_LEVEL = 53;
    export const GROUND_LEVEL = 54;

    export function generateBeaches(coords: Vector) {
        if(coords.y !== GROUND_LEVEL) {
            return;
        }

        if(World.getBlockID(coords.x, coords.y, coords.z) === VanillaBlockID.grass) {
            for(let i = 0; i <= 4; i++) {
                World.setBlock(coords.x, coords.y - i, coords.z, VanillaBlockID.sand, 0);
            }

            for(let y = coords.y - 4; y > coords.y - 10; y--) {
                World.setBlock(coords.x, y, coords.z, VanillaBlockID.sandstone, 0);
            }

            if(Math.random() < 0.0078) {
                placeColumn({ id: VanillaBlockID.cactus, data: 0 }, coords, MathHelper.randomInt(1, 5));
            }

            if(Math.random() < 0.004) {
                placeColumn({ id: VanillaBlockID.reeds, data: 0 }, coords, MathHelper.randomInt(2, 5));
            }

            if(Math.random() < 0.01 && World.getBlockID(coords.x, 55, coords.z) === VanillaTileID.air) {
                World.setBlock(coords.x, 55, coords.z, VanillaBlockID.deadbush, 0);
            }
        }
    }
};