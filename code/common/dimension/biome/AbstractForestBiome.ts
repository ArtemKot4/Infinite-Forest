abstract class AbstractForestBiome {
    public static readonly data: Record<number, AbstractForestBiome> = {};

    abstract readonly sign: string;
    public readonly id: number;
    public readonly stringID: string;
    public readonly biome: CustomBiome;

    public constructor(stringID: string) {
        this.biome = new CustomBiome(stringID);
        this.stringID = stringID;
        this.id = this.biome.id;

        if("getGrassColor" in this) {
            const color = this.getGrassColor();

            this.biome.setGrassColor(color[0] / 255, color[1] / 255, color[2] / 255);
        }

        if("getWaterColor" in this) {
            const color = this.getWaterColor();

            this.biome.setWaterColor(color[0] / 255, color[1] / 255, color[2] / 255);
        }

        if("getFoliageColor" in this) {
            const color = this.getFoliageColor();

            this.biome.setFoliageColor(color[0] / 255, color[1] / 255, color[2] / 255);
        }

        if("getStructures" in this) {
            const structures = this.getStructures();

            for(const structure of structures) {
                ForestGenerator.structurePool.load(structureDIR + structure.name + ".struct", structure.name);
            }
        }

        AbstractForestBiome.data[this.id] = this;
    }

    abstract getBiomeState(): EBiomeState;
    abstract getMapColor(): number[];

    public getBiomeMapCondition?(perlin: number): boolean;
    public getCurse?(): string;
    public getIconLocator(): string {
        return null;
    }

    public getRuntimeSkyColor?(): number[];
    public getRuntimeFogColor?(): number[];
    public getRuntimeCloudColor?(): number[];

    public getGrassColor?(): number[];
    public getWaterColor?(): number[];
    public getFoliageColor?(): number[];

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

    public static isExists(biome: number): boolean {
        return biome in AbstractForestBiome.data;
    }

    public static getFor(biome: number): Nullable<AbstractForestBiome> {
        return AbstractForestBiome.data[biome] || null;
    }
}
