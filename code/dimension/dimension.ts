const InfiniteForest = new Dimensions.CustomDimension("infinite_forest", 75);
InfiniteForest.setSkyColor(21 / 255, 96 / 255, 189 / 255);
InfiniteForest.setFogColor(0 / 255, 128 / 255, 0 / 255);
InfiniteForest.setHasSkyLight(false);

const structureDIR = __dir__ + "resources/structures/";
const ForestStructurePool = new StructurePool("infinite_structure_pool");

namespace ForestBiomes {
  export type BiomeStructure = {
    name: string;
    distance: int;
    chance: int;
    biome: int;
  };
  export class ForestBiome {
    public static structures: BiomeStructure[] = [];
    public biome: CustomBiome;
    constructor(
      name: string,
      grassColor?: number3,
      foliageColor: number3 = grassColor
    ) {
      this.biome = new CustomBiome(name);
      grassColor &&
        this.biome.setGrassColor(grassColor[0] / 255, grassColor[1] / 255, grassColor[2] / 255);
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
    public addStructure(name: string, distance: int, chance: int) {
      ForestStructurePool.load(structureDIR, name);
      ForestBiome.structures.push({ name, distance, chance, biome: this.getID() });
    }
    static {
      Callback.addCallback("StructureLoadOne", () => {
        for (const structure of ForestBiome.structures) {
          StructurePiece.register(
            StructurePiece.getDefault({
              type: "default",
              dimension: InfiniteForest.id,
              name: structure.name,
              chance: structure.chance,
              distance: structure.distance,
              isSet: true,
              structure: ForestStructurePool.StructureAdvanced(structure.name),
              biomes: [structure.biome],
            })
          );
        }
      });
    }
  };

  export const FirefliesForest = new ForestBiome("fireflies_forest");
  export const BurntForest = new ForestBiome("burnt_forest", [79, 79, 79]);
  export const VolcanicLands = new ForestBiome("volcanic_lands", [173, 173, 173]);
  export const WinterForest = new ForestBiome("winter_forest", [255, 255, 255]);

  WinterForest.addStructure("pink_tree", 15, 1000);
 

  export function addParticle(
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
  }
  export function generateCustomBiome(
    biome: ForestBiome,
    chunkX: int,
    chunkZ: int,
    dimensionSeed: int,
    density: int = 0.7
  ) {
    // if (
    //   GenerationUtils.getPerlinNoise(
    //     chunkX * 16 + 8,
    //     0,
    //     chunkZ * 16 + 8,
    //     dimensionSeed,
    //     1 / 128,
    //     2
    //   ) <
    //   density - 12 / 128
    // ) {
    //   return;
    // }
    // обход всего чанка
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
      if (
        GenerationUtils.getPerlinNoise(
          chunkX * 16 + 8,
          0,
          chunkZ * 16 + 8,
          dimensionSeed,
          1 / 128,
          2
        ) >
        0.5 - 12 / 128
      ) {
        generateCustomBiome(
          ForestBiomes.WinterForest,
          chunkX,
          chunkZ,
          dimensionSeed,
          0.5
        );
        return;
      }
      if (
        GenerationUtils.getPerlinNoise(
          chunkX * 16 + 8,
          0,
          chunkZ * 16 + 8,
          dimensionSeed,
          1 / 128,
          2
        ) >
        0.3 - 12 / 128
      ) {
        // обход всего чанка

        generateCustomBiome(
          ForestBiomes.BurntForest,
          chunkX,
          chunkZ,
          dimensionSeed,
          0.5
        );
      }
      if (
        GenerationUtils.getPerlinNoise(
          chunkX * 16 + 8,
          0,
          chunkZ * 16 + 8,
          dimensionSeed,
          1 / 128,
          2
        ) >
        0.8 - 12 / 128
      ) {
        generateCustomBiome(
          ForestBiomes.VolcanicLands,
          chunkX,
          chunkZ,
          dimensionSeed,
          0.8
        );
      }
    }
  );
}

const generator = Dimensions.newGenerator({
  biome: ForestBiomes.FirefliesForest.getID(),

  layers: [
    {
      minY: 0,
      maxY: 55,
      yConversion: [
        [0, 1],
        [-1, 0.4],
      ],
      material: { base: 9 },
    },

    {
      minY: 0,
      maxY: 120,
      yConversion: [
        [0, 1.7],
        [1, -1.9],
      ],
      material: { base: 1, surface: { id: 3, data: 0, width: 3 }, cover: 2 },
      noise: {
        octaves: { count: 5, scale: 70 },
      },
    },

    {
      minY: 0,
      maxY: 1,
      yConversion: [[0.7, 1]],
      material: { base: 7 },
    },
  ],
});

InfiniteForest.setGenerator(generator);

interface IPlantDesc {
  coords: Vector;
  place: Vector;
  id: number;
  random: [number, number];
}

/*


{
  layers: [
   {
     minY: 10,
     maxY: 55,
     yConversion: [[0, 0]],
     material: { base: 9 },
   },
 
   
    {
     minY: 0,
     maxY: 100,
     yConversion: [
       [0, 1],
       [1, -0.95],
     ],
     material: { base: 1, surface: { id: 3, data: 0, width: 3 }, cover: 2 },
     noise: {
       octaves: { count: 5, scale: 100 },
     },
   },
   
   
   {
     minY: 2,
     maxY: 4,
     yConversion: [[0.7, 1]],
     material: { base: 7 },
   },
 ],
}








{
  layers: [
   {
     minY: 0,
     maxY: 55,
     yConversion: [[0, 1], [-1, 0.4]],
     material: { base: 9 },
   },
 
   
    {
     minY: 0,
     maxY: 120,
     yConversion: [
       [0, 1.7],
       [1, -1.9],
     ],
     material: { base: 1, surface: { id: 3, data: 0, width: 3 }, cover: 2 },
     noise: {
       octaves: { count: 5, scale: 70 },
     },
   },
   
   
   {
     minY: 0,
     maxY: 1,
     yConversion: [[0.7, 1]],
     material: { base: 7 },
   },
 ],
}



 layers: [
    {
      minY: 0,
      maxY: 55,
      yConversion: [
        [0, 1],
        [-1, 0.4],
      ],
      material: { base: 9 },
    },

    {
      minY: 0,
      maxY: 120,
      yConversion: [
        [0, 1.7],
        [1, -1.9],
      ],
      material: { base: 1, surface: { id: 3, data: 0, width: 3 }, cover: 2 },
      noise: {
        octaves: { count: 5, scale: 70 },
      },
    },

    {
      minY: 0,
      maxY: 1,
      yConversion: [[0.7, 1]],
      material: { base: 7 },
    },
  ], //TODO: OLD NEW


  
  layers: [
    {
      minY: 0,
      maxY: 55,
      yConversion: [
        [0, 1],
        [-1, 0.4],
      ],
      material: { base: 9 },
    },

    {
      minY: 0,
      maxY: 200,
      yConversion: [
        [0, 0.6],
        [1, -1.2],
      ],
      material: { base: 1, surface: { id: 3, data: 0, width: 3 }, cover: 2 },
      noise: {
        octaves: { count: 8, scale: 145 },
      },
    },

    {
      minY: 0,
      maxY: 1,
      yConversion: [[0.7, 1]],
      material: { base: 7 },
    },
  ], //TODO: NEW






  layers: [
    {
      minY: 0,
      maxY: 35,
      yConversion: [
        [0, 1],
        [-1, 0.4],
      ],
      material: { base: 9 },
    },

    {
      minY: 0,
      maxY: 150,
      yConversion: [
        [0, 0.4],
        [1, -0.9],
      ],
      material: { base: 1, surface: { id: 3, data: 0, width: 3 }, cover: 2 },
      noise: {
        octaves: { count: 5, scale: 170 },
      },
    },

    {
      minY: 0,
      maxY: 1,
      yConversion: [[0.7, 1]],
      material: { base: 7 },
    },
  ], //TODO: NEW NEW 





*/

// Callback.addCallback("ItemUse", (сoords) => {
//   Game.message(
//     "FirefliesForest: " +
//       ForestBiomes.FirefliesForest.id +
//       "\nBurntForest: " +
//       ForestBiomes.BurntForest.id +
//       "\nVolcanicLands: " +
//       ForestBiomes.VolcanicLands.id +
//       "\nWinterForest: " +
//       ForestBiomes.WinterForest.id +
//       "\n"
//   );
//   Game.message(
//     "Current: " +
//       World.getBiomeMap(сoords.x, сoords.z) +
//       " | " +
//       World.getBiome(сoords.x, сoords.z)
//   );
// });
