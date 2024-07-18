const InfiniteForest = new Dimensions.CustomDimension("infinite_forest", 75);
InfiniteForest.setSkyColor(21 / 255, 96 / 255, 189 / 255);
InfiniteForest.setFogColor(0 / 255, 128 / 255, 0 / 255);

namespace ForestBiomes {
  export const FirefliesForest = new CustomBiome("fireflies_forest");
  export const BurntForest = new CustomBiome("burnt_forest");
  export const VolcanicLands = new CustomBiome("volcanic_lands");
  export const WinterForest = new CustomBiome("winter_forest");

  //FirefliesForest.setSkyColor(21 / 255, 96 / 255, 189 / 255);

  //WinterForest.setSkyColor(128 / 255, 236 / 255, 255 / 255);
  WinterForest.setFoliageColor(173 / 255, 173 / 255, 173 / 255);
  WinterForest.setGrassColor(255 / 255, 255 / 255, 255 / 255);
  WinterForest.setTemperatureAndDownfall(0, 0.5);

  //BurntForest.setSkyColor(99 / 255, 64 / 255, 2 / 255);
  //BurntForest.setFoliageColor(79 / 255, 79 / 255, 79 / 255);
  BurntForest.setGrassColor(79, 79, 79);

  //VolcanicLands.setSkyColor(173 / 255, 173 / 255, 173 / 255);
  VolcanicLands.setCoverBlock(VanillaBlockID.stone, 0);
  VolcanicLands.setSurfaceBlock(VanillaBlockID.stone, 0);
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
    biome: CustomBiome,
    chunkX: int,
    chunkZ: int,
    dimensionSeed: int,
    density: int = 0.7
  ) {
    if (
      GenerationUtils.getPerlinNoise(
        chunkX * 16 + 8,
        0,
        chunkZ * 16 + 8,
        dimensionSeed,
        1 / 128,
        2
      ) <
      density - 12 / 128
    ) {
      return;
    }
    // обход всего чанка
    for (let x = chunkX * 16; x < (chunkX + 1) * 16; x++) {
      for (let z = chunkZ; z < (chunkZ + 1) * 16; z++) {
        if (
          GenerationUtils.getPerlinNoise(x, 0, z, dimensionSeed, 1 / 128, 2) >
          density
        ) {
          World.setBiomeMap(x, z, biome.id);
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
        ) <
        0.8 - 12 / 128
      ) {
        return
      }
      // обход всего чанка
      for (let x = chunkX * 16; x < (chunkX + 1) * 16; x++) {
        for (let z = chunkZ; z < (chunkZ + 1) * 16; z++) {
          if (
            GenerationUtils.getPerlinNoise(x, 0, z, dimensionSeed, 1 / 128, 2) >
            0.3
          ) {
            World.setBiomeMap(x, z, ForestBiomes.WinterForest.id);
          }
        }
      }

    }
  );

}

InfiniteForest.setHasSkyLight(false);

const generator = Dimensions.newGenerator({
  biome: ForestBiomes.FirefliesForest.id,

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
