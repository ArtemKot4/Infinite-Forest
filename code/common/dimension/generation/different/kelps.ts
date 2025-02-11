namespace ForestGenerator {
    
    export const waterBlockList = [VanillaTileID.air, VanillaBlockID.water, VanillaBlockID.flowing_water];

    export function generateKelps(x: number, y: number, z: number, height: number) {
        if (Math.random() < 0.05) {
            if (waterBlockList.includes(World.getBlockID(x, y, z))) {
                for (let i = 0; i <= height; i++) {

                    World.setBlock(x, y + i, z, VanillaTileID.kelp, 0);
                }
            }
        }
    };
};