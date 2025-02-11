namespace ForestGenerator {
    export const mysticPathBlockList = [   
        VanillaBlockID.podzol,
        VanillaBlockID.leaves,
        VanillaBlockID.leaves2,
        VanillaBlockID.ice,
        VanillaBlockID.mossy_cobblestone,
        VanillaBlockID.vine,
        VanillaBlockID.mycelium,
        VanillaBlockID.stone,
        VanillaBlockID.gravel
    ];

    export function generateMysticPath(chunkX: number, chunkZ: number) {
        if (Math.random() < 0.01) {
            
            const block = MathHelper.randomFromArray(
                mysticPathBlockList 
            );

            for (let i = 0; i <= 64; i++) {

                let coords = GenerationUtils.randomCoords(chunkX, chunkZ);
                coords = GenerationUtils.findSurface(coords.x, 90, coords.z);

                if (coords.y <= GROUND_LEVEL) return;
                
                if (World.getBlockID(coords.x, coords.y, coords.z) === VanillaBlockID.grass) {
                    if (block === VanillaBlockID.mycelium && Math.random() < 0.15) {
                        const mushroom = MathHelper.randomFrom<number>(VanillaBlockID.red_mushroom, VanillaBlockID.brown_mushroom, BlockID["electric_mushroom"]);
                        World.setBlock(coords.x, coords.y + 1, coords.z, mushroom, 0);
                    };

                    if (block === VanillaBlockID.ice && Math.random() < 0.05) {
                        World.setBlock(coords.x, coords.y + 1, coords.z, BlockID["ice_flower"], 0);
                    };

                    if (block === VanillaBlockID.podzol && Math.random() < 0.1) {
                        World.setBlock(coords.x, coords.y + 1, coords.z, VanillaBlockID.sweet_berry_bush, randomInt(1, 4));
                    };
                };
                World.setBlock(coords.x, coords.y, coords.z, block, 0);
            };
        };
    };
};