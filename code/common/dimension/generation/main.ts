Callback.addCallback("GenerateCustomDimensionChunk", (chunkX, chunkZ, random, dimensionId) => {
    if(dimensionId !== EDimension.INFINITE_FOREST.id) return;

    for(let x = chunkX * 16; x < (chunkX + 1) * 16; x++) {
        for(let z = chunkZ; z < (chunkZ + 1) * 16; z++) {
            const coords = GenerationUtils.findSurface(x, 90, z);
            ForestGenerator.generateBeaches(coords);
            // if (coords.y > 54) {
            //  generateSnowLayers(coords, x, z);
            //  generateReliefPeaks(coords, x, z);
            // }
        }
    }

    ForestGenerator.generateLakeBottom(chunkX, chunkZ);
    ForestGenerator.generateGroundCaves(chunkX, chunkZ);
    ForestGenerator.generateMysticPath(chunkX, chunkZ);
    PlantGenerator.init(chunkX, chunkZ);

    for(const biomeId in AbstractForestBiome.data) {
        const biomeData = AbstractForestBiome.data[biomeId];

        if(!biomeData.getStructures) continue;

        const structures = biomeData.getStructures();

        if(!structures) continue;
        
        for(let i in structures) {
            const structure = structures[i];

            for(let count = 1; count <= structure.count; count++) {
                let coords = GenerationUtils.randomCoords(chunkX, chunkZ);
                coords = GenerationUtils.findSurface(coords.x, 127, coords.z);
                
                if(World.getBiome(coords.x, coords.z) !== Number(biomeId)) continue;

                if(World.getBlockID(coords.x, coords.y, coords.z) !== VanillaBlockID.grass) return;

                if (coords.y < 55) continue;

                if (Math.random() > structure.chance) continue;
                
                Structure.set(
                    ForestGenerator.structurePool.get(structure.name),
                    coords.x,
                    coords.y + 1,
                    coords.z,
                BlockSource.getCurrentWorldGenRegion()
                );      
            }
        }
    }
});

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
    if(dimensionId !== EDimension.INFINITE_FOREST.id) {
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
