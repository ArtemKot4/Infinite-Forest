namespace ForestBiomes {
  export type BiomeStructure = {
    [name: string]: {
      chance: int,
      count: int
    }
  };

  export class ForestBiome {
    public structures: BiomeStructure = {}
    public biome: CustomBiome;
    constructor(
      name: string,
      grassColor?: number3,
      foliageColor: number3 = grassColor
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
    }
    public getID() {
      return this.biome.id;
    }
    public addStructure(name: string, chance: int, count: int) {
      ForestStructurePool.load(structureDIR, name, "DungeonCore");
       this.structures[name] = {
        chance, 
        count
      };
    };
    public generateChunkStructure(name: string, coords: Vector) {
      const descriptor = this.structures[name];
      if(descriptor.chance && Math.random() > descriptor.chance) return;
      for(let i = 0; i <= descriptor.count; i++) {
        Structure.setStructure(name, coords.x, coords.y, coords.z, BlockSource.getCurrentWorldGenRegion());
      };
      return;
    }
    static {
      // Callback.addCallback("StructureLoadOne", () => {
      //   for (const structure of ForestBiome.structures) {
      //     StructurePiece.register(
      //       StructurePiece.getDefault({
      //         type: "default",
      //         dimension: InfiniteForest.id,
      //         name: structure.name,
      //         chance: structure.chance,
      //         distance: structure.distance,
      //         structure: ForestStructurePool.StructureAdvanced(structure.name),
      //         biomes: [structure.biome],
      //       })
      //     );
      //   }
      // });
    }
  }

  export const FirefliesForest = new ForestBiome("fireflies_forest");
  export const BurntForest = new ForestBiome("burnt_forest", [79, 79, 79]);
  export const VolcanicLands = new ForestBiome(
    "volcanic_lands",
    [173, 173, 173]
  );
  export const WinterForest = new ForestBiome("winter_forest", [255, 255, 255]);
  export const IcePeaks = new ForestBiome("ice_peaks", [255, 255, 255]);
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
          World.setBiomeMap(x, z, biome.getID());
        }
      }
    }
    return;
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
      if (perlinNoise > 0.8 - 12 / 128) {
        generateCustomBiome(
          ForestBiomes.BurntForest,
          chunkX,
          chunkZ,
          dimensionSeed,
          0.7
        );
        return;
      }
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
