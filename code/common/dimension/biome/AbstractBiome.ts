abstract class AbstractBiome {
    public static readonly data: Record<number, AbstractBiome> = {};

    public readonly id: number;
    public readonly stringID: string;
    public readonly biome: CustomBiome;

    public constructor(stringID: string) {
        this.biome = new CustomBiome(stringID);
        this.stringID = stringID;
        this.id = this.biome.id;

        if("getGrassColor" in this) {
            const color = this.getGrassColor();

            this.biome.setGrassColor(color.r / 255, color.g / 255, color.b / 255);
        };

        if("getWaterColor" in this) {
            const color = this.getWaterColor();

            this.biome.setWaterColor(color.r / 255, color.g / 255, color.b / 255);
        };

        if("getFoliageColor" in this) {
            const color = this.getFoliageColor();

            this.biome.setFoliageColor(color.r / 255, color.g / 255, color.b / 255);
        };

        if("getStructures" in this) {
            const structures = this.getStructures();

            for(const structure of structures) {
                ForestGenerator.structurePool.load(structureDIR + structure.name + ".struct", structure.name);
            }
            
        }

        AbstractBiome.data[this.id] = this;
    }

    abstract getBiomeState(): EBiomeState;

    public getRuntimeSkyColor?(): RGB;
    public getRuntimeFogColor?(): RGB;
    public getRuntimeCloudColor?(): RGB;

    public getGrassColor?(): RGB;
    public getWaterColor?(): RGB;
    public getFoliageColor?(): RGB;

    public getStructures?(): {name: string, chance: number, count: number}[];

    abstract getPlantList(): Nullable<Record<string, { rarity: number; count?: number; data?: number; tile?: boolean }>>;

    public getBiome(): CustomBiome {
        return this.biome;
    }

    public getStringID(): string {
        return this.stringID;
    }

    public getID(): number {
        return this.id;
    }

    public static getFor(biome: number): AbstractBiome {
        return AbstractBiome.data[biome];
    }
}
