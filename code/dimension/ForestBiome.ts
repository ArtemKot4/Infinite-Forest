namespace ForestBiomes {
  export type BiomeStructure = {
    name: string;
    distance: int;
    chance: int;
    biome: int;
    prototype?: StructurePrototype;
  };
  export const HEART_FOREST_COORDS = 200;
  export class ForestBiome {
    protected static list: Record<int, EForestState> = {};
    public static chunkStructures: Record<name, {chance: int, cover_block: int, biome: int, count: int}> = {};
    public static structures: BiomeStructure[] = [];
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
      this.id = this.biome.id;
      ForestBiome.list[this.id] = state;
    }
    public id: int;
    public loadStructure(name: string) {
      return ForestStructurePool.load(structureDIR + name + ".struct", name);
    }
    public addStructure(name: string, distance: int, chance: int, prototype?: StructurePrototype) {
      ForestStructurePool.load(structureDIR + name + ".struct", name);
      ForestBiome.structures.push({
        name: name,
        distance: distance,
        chance: chance,
        biome: this.id,
      });
    };
    public addChunkStructure(name: string, chance: int, count: int, cover_block: int = VanillaBlockID.grass) {
      ForestStructurePool.load(structureDIR + name + ".struct", name);
       ForestBiome.chunkStructures[name] = {chance, cover_block, biome: this.id, count};
    }
    public static generateStructure(
      name: string,
      chunkX: int,
      chunkZ: int,
      biome: int,
      count: int = 2,
      random: int = 0.94,
      cover_block: int
    ) {
      for (let i = 0; i < count; i++) {
        let coords = GenerationUtils.randomCoords(chunkX, chunkZ);
        coords = GenerationUtils.findSurface(coords.x, 127, coords.z);
        if (coords.y <= 94) return;
        if (random && Math.random() > random) return;
        if (World.getBiome(coords.x, coords.z) !== biome) {
          return;
        }
        if (World.getBlockID(coords.x, coords.y + 1, coords.z) !== AIR) {
          return;
        }
        if (
          World.getBlockID(coords.x, coords.y, coords.z) !==
          cover_block
        ) {
          return;
        }
        Structure.set(
          ForestStructurePool.get(name),
          coords.x,
          coords.y + 1,
          coords.z,
          BlockSource.getCurrentWorldGenRegion()
        );
      }
      return;
    }
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
              isSet: false,
              structure: structure.prototype
                ? ForestStructurePool.StructureAdvanced(
                    structure.name
                  ).setPrototype(structure.prototype)
                : ForestStructurePool.StructureAdvanced(structure.name),
              biomes: [structure.biome],
              white_list: true,
              white_list_blocks: true,
              blocks: [VanillaBlockID.grass]
              //count: [structure.chance]
            })
          );
        }
      });
    }
  } 
  export const FirefliesForest = new ForestBiome("fireflies_forest");
  export const BurntForest = new ForestBiome(
    "burnt_forest",
    [79, 79, 79],
    null,
    EForestState.FIRE
  );
  /*export const VolcanicLands = new ForestBiome(
    "volcanic_lands",
    [173, 173, 173]
  );*/
  export const WinterForest = new ForestBiome(
    "winter_forest",
    [255, 255, 255],
    null,
    EForestState.ICE
  );
  export const IcePeaks = new ForestBiome(
    "ice_peaks",
    [255, 255, 255],
    null,
    EForestState.ICE
  );
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
      ParticlePacket.send(
        particle,
        x + randomInt(-radius, radius),
        y,
        z,
        vx,
        vy,
        vz,
        Player.getLocal()
      );
      ParticlePacket.send(
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
  }

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
          World.setBiomeMap(x, z, biome.id); //  World.setBiomeMap(x, z, biome.getID());
        }
      }
    }
    return;
  }

  export function generateHeartForest(chunkX: int, chunkZ: int) {
    let isHeart = false;
    for (let x = chunkX * 16; x < (chunkX + 1) * 16; x++) {
      for (let z = chunkZ; z < (chunkZ + 1) * 16; z++) {
        if (
          x >= HEART_FOREST_COORDS &&
          z >= HEART_FOREST_COORDS &&
          x <= HEART_FOREST_COORDS * 1.3333333 &&
          z <= HEART_FOREST_COORDS * 1.3333333
        ) {
          World.setBiomeMap(x, z, HeartForest.id);
          isHeart = true;
        }
      }
    }
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
      if (isHeart) return;
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
