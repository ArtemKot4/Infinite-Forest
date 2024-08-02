namespace ForestBiomes {
  export type BiomeStructure = {
    name: string,
    distance: int,
    chance: int,
    biome: int
  };
  export const HEART_FOREST_COORDS = 200;
  export class ForestBiome {

    protected static list: Record<int, EForestState> = {}
    public static structures: BiomeStructure[] = []
    public biome: CustomBiome;
    constructor(
      name: string,
      grassColor?: number3,
      foliageColor: number3 = grassColor,
      state: EForestState = EForestState.BALANCE
    ) {
      this.biome = new CustomBiome(name);
      grassColor &&
        this.biome.setGrassColor(
          grassColor[0] / 255,
          grassColor[1] / 255,
          grassColor[2] / 255
        );
      foliageColor &&
        this.biome.setFoliageColor(
          foliageColor[0] / 255,
          foliageColor[1] / 255,
          foliageColor[2] / 255
        );
        ForestBiome[this.getID()] = state;
    }
    public getID() {
      return this.biome.id;
    }
    public addStructure(name: string, distance: int, chance: int) {
      ForestStructurePool.load(structureDIR + name + ".struct", name);
      ForestBiome.structures.push({
          name: name,
          distance: distance,
          chance: chance,
          biome: this.getID(),
      });
    };
    static getState(biome: int): EForestState {
      return ForestBiome.list[biome] || EForestState.BALANCE;
    }
    static {
      Callback.addCallback("StructureLoadOne", () => {
        for (const structure of ForestBiome.structures) {
          Game.message(JSON.stringify(ForestBiome.structures));
          StructurePiece.register(
            StructurePiece.getDefault({
              type: "default",
              dimension: InfiniteForest.id,
              name: structure.name,
              chance: structure.chance,
              distance: structure.distance,
              structure: ForestStructurePool.StructureAdvanced(structure.name),
             // biomes: [structure.biome],
            })
          );
        }
      });
    }
  }

  export const FirefliesForest = new ForestBiome("fireflies_forest");
  export const BurntForest = new ForestBiome("burnt_forest", [79, 79, 79]);
  /*export const VolcanicLands = new ForestBiome(
    "volcanic_lands",
    [173, 173, 173]
  );*/
  export const WinterForest = new ForestBiome("winter_forest", [255, 255, 255], null, EForestState.ICE);
  export const IcePeaks = new ForestBiome("ice_peaks", [255, 255, 255], null, EForestState.ICE);
  export const HeartForest = new ForestBiome("heart_forest", [79, 79, 79]);

  export function addSquareParticle(
    particle: EForestParticle,
    count: int,
    radius: int = 16,
    x: int,
    y: int,
    z: int,
    vx: int,
    vy: int,
    vz: int
  ) {
    for (let i = 0; i < count; i++) {
      ForestParticle.send(
        particle,
        x + randomInt(-radius, radius),
        y,
        z,
        vx,
        vy,
        vz,
        Player.getLocal()
      );
      ForestParticle.send(
        particle,
        x,
        y,
        z + randomInt(-radius, radius),
        vx,
        vy,
        vz,
        Player.getLocal()
      );
    }
  };

  export function generateCustomBiome(
    biome: ForestBiome,
    chunkX: int,
    chunkZ: int,
    dimensionSeed: int,
    density: int = 0.7
  ) {
    for (let x = chunkX * 16; x < (chunkX + 1) * 16; x++) {
      for (let z = chunkZ; z < (chunkZ + 1) * 16; z++) {
        if (
          GenerationUtils.getPerlinNoise(x, 0, z, dimensionSeed, 1 / 128, 2) >
          density
        ) {
          World.setBiomeMap(x, z, biome.getID()); //  World.setBiomeMap(x, z, biome.getID());
        }
      }
    }
    return;
  };
  
  export function generateHeartForest(chunkX: int, chunkZ: int) {
    let isHeart = false;
    for (let x = chunkX * 16; x < (chunkX + 1) * 16; x++) {
      for (let z = chunkZ; z < (chunkZ + 1) * 16; z++) {
        if(x >= HEART_FOREST_COORDS && z >= HEART_FOREST_COORDS && x <= HEART_FOREST_COORDS * 1.25 && z <= HEART_FOREST_COORDS * 1.25) {
          World.setBiomeMap(x, z, HeartForest.getID());
          isHeart = true;
        }
      }
    };
    return isHeart;
  }

  Callback.addCallback(
    "GenerateBiomeMap",
    function (
      chunkX,
      chunkZ,
      random,
      dimensionId,
      chunkSeed,
      worldSeed,
      dimensionSeed
    ) {
      if (dimensionId !== InfiniteForest.id) {
        return;
      }
      const isHeart = generateHeartForest(chunkX, chunkZ);
      if(isHeart) return;
      const perlinNoise = GenerationUtils.getPerlinNoise(
        chunkX * 16 + 8,
        0,
        chunkZ * 16 + 8,
        dimensionSeed,
        1 / 128,
        2
      );
      
      if (perlinNoise > 0.7 - 12 / 128) {
        generateCustomBiome(
          ForestBiomes.IcePeaks,
          chunkX,
          chunkZ,
          dimensionSeed,
          0.7
        );
        return;
      };
      if (perlinNoise > 0.7 - 12 / 128) {
        generateCustomBiome(
          ForestBiomes.WinterForest,
          chunkX,
          chunkZ,
          dimensionSeed,
          0.7
        );
        return;
      }
      // if (perlinNoise > 0.8 - 12 / 128) {
      //   generateCustomBiome(
      //     ForestBiomes.BurntForest,
      //     chunkX,
      //     chunkZ,
      //     dimensionSeed,
      //     0.7
      //   );
      //   return;
      // }
      // if (perlinNoise > 0.9 - 12 / 128) {
      //   generateCustomBiome(
      //     ForestBiomes.VolcanicLands,
      //     chunkX,
      //     chunkZ,
      //     dimensionSeed,
      //     0.9
      //   );
      //   return;
      // }
    }
  );
}
