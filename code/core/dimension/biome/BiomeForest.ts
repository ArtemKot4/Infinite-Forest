interface IBiomeData {
    plants?: (Tile & { chance: number })[],
    runtime: { sky: RGB; fog: RGB; cloud: RGB },
    events?: BiomeDetectComponent & {
        onTick?(player: number, region: BlockSource, x: number, y: number, z: number): void
    },
    state: EBiomeState
}

abstract class BiomeForest implements BiomeDetectComponent {

  public static readonly data: Record<number, IBiomeData> = {};

  public readonly id: number;
  public readonly stringID: string;
  public readonly biome: CustomBiome;

  public constructor(stringID: string) {

    this.biome = new CustomBiome(stringID);
    this.stringID = stringID;
    this.id = this.biome.id;

    const data = { events: {} } as IBiomeData;

    data.state = this.getBiomeState();
    
    if(this.getPlantList() != null) {
        
      const entries = Object.entries(this.getPlantList());

      data.plants = entries.map(
         (v) => {
           const split = v[0].split(":");
             return { id: parseBlockID(split[0]), data: Number(split[1] || 0), chance: v[1] };
         }
     );
  };

    data.runtime = {
      sky: this.getRuntimeSkyColor && this.getRuntimeSkyColor(),
      fog: this.getRuntimeFogColor && this.getRuntimeFogColor(),
      cloud: this.getRuntimeCloudColor && this.getRuntimeCloudColor(),
    };

    if('onBiomeDetected' in this) {
        data.events.onBiomeDetected = this.onBiomeDetected;
    };

    if('onTick' in this) {
        data.events.onTick = this.onTick;
    };

    BiomeForest.data[this.id] = data;
  }

  abstract getBiomeState(): EBiomeState;

  public getRuntimeSkyColor?(): RGB;
  public getRuntimeFogColor?(): RGB;
  public getRuntimeCloudColor?(): RGB;

  public getGrassColor?(): RGB;
  public getWaterColor?(): RGB;
  public getFoliageColor?(): RGB;

  public onBiomeDetected?(coordsX: number,coordsZ: number,x: number,y: number,z: number, surface: Tile): void;

  /**
   * @returns object, contains keys as string id's of blocks, and values as chance;
   */

  public onTick?(player: number, region: BlockSource, x: number, y: number, z: number): void;

  abstract getPlantList(): Record<string, number>;

  public getBiome(): CustomBiome {
    return this.biome;
  }

  public getStringID(): string {
    return this.stringID;
  }

  public getID(): number {
    return this.id;
  }
}
