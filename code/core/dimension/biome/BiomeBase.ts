abstract class BiomeBase {

  public static readonly data: Record<number, BiomeBase> = {};

  public readonly id: number;
  public readonly stringID: string;
  public readonly biome: CustomBiome;

  public constructor(stringID: string) {

    this.biome = new CustomBiome(stringID);
    this.stringID = stringID;
    this.id = this.biome.id;

    BiomeBase.data[this.id] = this;
  }

  abstract getBiomeState(): EBiomeState;

  public getRuntimeSkyColor?(): RGB;
  public getRuntimeFogColor?(): RGB;
  public getRuntimeCloudColor?(): RGB;

  public getGrassColor?(): RGB;
  public getWaterColor?(): RGB;
  public getFoliageColor?(): RGB;

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
