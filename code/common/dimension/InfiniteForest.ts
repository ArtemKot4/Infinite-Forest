interface IForestDungeon {
    [position: string]: string 
}

class InfiniteForest extends Dimension {
    public static data = {
        vinePos: [null, null],
        dungeons: new Map<[number, number], string>()
    } 

    public constructor() {
        super(75, "infinite_forest", BiomeList.FIREFLIES_FOREST.biome);
    }

    public override getSkyColor(): number[] {
        return ConfigManager.LEGACY_SKY_COLOR ? [.05,.2, .3] : [21 / 255, 96 / 255, 189 / 255];
    }

    public override getFogColor(): number[] {
        return ConfigManager.LEGACY_SKY_COLOR ? [0, .6, .3] : [0, 128 / 255, 0];
    }

    public override hasSkyLight(): boolean {
        return true;
    }

    public override getLayers(): Dimensions.TerrainLayerParams[] {
        return [
            {
                minY: 0,
                maxY: 55,
                yConversion: [
                    [0, 1],
                    [-1, 0.4],
                ],
                material: { base: VanillaBlockID.water }
            },
            {
                minY: 0,
                maxY: 55,
                yConversion: [
                    [0, 1],
                    [-1, 0.4],
                ],
                material: { base: VanillaBlockID.water }
            },
            {
                minY: 0,
                maxY: 120,
                yConversion: [
                    [0, 1.7],
                    [1, -1.9],
                ],
                material: {
                    base: VanillaBlockID.stone,
                    surface: { id: VanillaBlockID.dirt, data: 0, width: 3 },
                    cover: VanillaBlockID.grass
                },
                noise: {
                    octaves: { count: 5, scale: 70 },
                }
            }
        ];
    }

    public override generateCaves(): [boolean, boolean] {
        return [false, false];
    }

    public override getTags(): string[] {
        return ["nature", "magic", "forest"];
    }

    public override generateDimensionChunk(chunkX: number, chunkZ: number, random: java.util.Random): void {
        for(let x = chunkX * 16; x < (chunkX + 1) * 16; x++) {
            for(let z = chunkZ; z < (chunkZ + 1) * 16; z++) {
                ForestGenerator.generateBeaches(GenerationUtils.findSurface(x, 90, z));
            }
        }
        ForestGenerator.generateLakeBottom(chunkX, chunkZ);
        ForestGenerator.generateGroundCaves(chunkX, chunkZ);
        ForestGenerator.generateMysticPath(chunkX, chunkZ);
        PlantGenerator.init(chunkX, chunkZ);
    
        for(const biomeId in AbstractForestBiome.data) {
            const biomeData = AbstractForestBiome.data[biomeId];
            if(!biomeData.getStructures) {
                continue;
            }
            const structures = biomeData.getStructures();
            if(!structures) {
                continue;
            }
            
            for(const i in structures) {
                const structure = structures[i];
    
                for(let count = 1; count <= structure.count; count++) {
                    let coords = GenerationUtils.randomCoords(chunkX, chunkZ);
                    coords = GenerationUtils.findSurface(coords.x, 127, coords.z);

                    if(World.getBlockID(coords.x, coords.y, coords.z) != VanillaBlockID.grass) {
                        return;
                    }

                    if(
                        coords.y < 55 ||
                        World.getBiome(coords.x, coords.z) != Number(biomeId) || 
                        Math.random() > structure.chance
                    ) {
                        continue;
                    }
                    
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
    }
}

namespace DimensionList {
    export const INFINITE_FOREST = new InfiniteForest();
}