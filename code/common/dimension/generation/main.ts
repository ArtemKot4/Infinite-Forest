/*
Callback.addCallback("StructureLoadOne", () => {
    for(const biome_id in AbstractBiome.data) {
        const biome_data = AbstractBiome.data[biome_id];

        if(!biome_data.getStructures) {
            continue;
        }

        const structures = biome_data.getStructures();

        if(!structures) {
            continue;
        }
        
        for(let i in structures) {
            const description = structures[i];

            StructurePiece.register(StructurePiece.getDefault({
                name: description.name,
                dimension: EDimension.INFINITE_FOREST.id,
                biomes: [Number(biome_id)],
                white_list_blocks: true,
                blocks: [VanillaBlockID.grass],
                structure: new Structure.advanced(ForestGenerator.structurePool.get(description.name)),
                count: [description.count],
                isSet: false,
                chance: description.chance,
                minAndMaxY: [55, 128]
            }));
        }
    } 
});*/

namespace ForestGenerator {
    export function generateCustomBiome(biome: number, chunkX: number, chunkZ: number, dimensionSeed: number, density: number = 0.7) {
        for(let x = chunkX * 16; x < (chunkX + 1) * 16; x++) {
            for(let z = chunkZ; z < (chunkZ + 1) * 16; z++) {
                const perlinNoise = GenerationUtils.getPerlinNoise(x, 0, z, dimensionSeed, 1 / 128, 2);
                
                if(perlinNoise > density) {
                    World.setBiomeMap(x, z, biome); //  World.setBiomeMap(x, z, biome.getID());
                }
            }
        }
    }
}

Callback.addCallback("GenerateBiomeMap",(chunkX, chunkZ, random, dimensionId, chunkSeed, worldSeed, dimensionSeed) => {
    if(dimensionId == DimensionList.INFINITE_FOREST.id) {
        return;
    }

    const perlinNoise = GenerationUtils.getPerlinNoise(
        chunkX * 16 + 8,
        0,
        chunkZ * 16 + 8,
        dimensionSeed,
        1 / 128,
        2
    );

    if(perlinNoise > 0.7 - 12 / 128) {
        ForestGenerator.generateCustomBiome(
        BiomeList.WINTER_FOREST.id,
            chunkX,
            chunkZ,
            dimensionSeed,
    0.7 - 12 / 128
        );
    }
});
