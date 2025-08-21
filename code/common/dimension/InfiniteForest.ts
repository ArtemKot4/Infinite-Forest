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

    public getSkyColor(): number[] {
        return ConfigManager.LEGACY_SKY_COLOR ? [.05,.2, .3] : [21 / 255, 96 / 255, 189 / 255];
    }

    public getFogColor(): number[] {
        return ConfigManager.LEGACY_SKY_COLOR ? [0, .6, .3] : [0, 128 / 255, 0];
    }

    public hasSkyLight(): boolean {
        return true;
    }

    public getLayers(): Dimensions.TerrainLayerParams[] {
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

    public generateCaves(): [boolean, boolean] {
        return [false, false];
    }

    public getTags(): string[] {
        return ["nature", "magic", "forest"];
    }
}

namespace DimensionList {
    export const INFINITE_FOREST = new InfiniteForest();
}