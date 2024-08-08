namespace ForestGeneration {
  export type plantDescriptor = {
    chance: int;
    id: int;
    data: int;
    count: int;
    biome?: ForestBiomes.ForestBiome;
  };
  const plants: plantDescriptor[] = [];
  export function addPlant(
    chance: int,
    id: int,
    data: int = 0,
    count: int,
    biome?: ForestBiomes.ForestBiome
  ) {
    plants.push({ chance, id, data, count, biome });
  }
  export function generatePlants(chunkX: number, chunkZ: number) {
    for (const obj of plants) {
      for (let i = 1; i <= obj.count; i++) {
        let coords = GenerationUtils.randomCoords(chunkX, chunkZ);
        coords = GenerationUtils.findSurface(coords.x, 90, coords.z);
        if (obj.biome && World.getBiome(coords.z, coords.z) !== obj.biome.id) {
          continue;
        }
        if (Math.random() < obj.chance) {
          if (coords.y > 54) {
            if (
              World.getBlockID(coords.x, coords.y, coords.z) ===
                VanillaBlockID.grass &&
              World.getBlockID(coords.x, coords.y + 1, coords.z) === AIR
            ) {
              World.setBlock(
                coords.x,
                coords.y + 1,
                coords.z,
                obj.id,
                obj.data || 0
              );
            }
          }
        }
      }
      // for (let i = 0; i <= 6; i++) {
      //   let coords = GenerationUtils.randomCoords(chunkX, chunkZ);
      //   coords = GenerationUtils.findSurface(coords.x, 90, coords.z);
      //   if (coords.y > 54) {
      //     if (
      //       World.getBlockID(coords.x, coords.y, coords.z) ===
      //         VanillaBlockID.grass &&
      //       World.getBlockID(coords.x, coords.y + 1, coords.z) === AIR
      //     ) {
      //       for (const plant of plants) {
      //         if (Math.random() > plant.chance) {
      //           if (plant.biome) {
      //             if (
      //               World.getBiome(coords.x, coords.z) === plant.biome.getID()
      //             ) {
      //               for (let i = 0; i <= plant.count; i++) {
      //                 Plants.generate(coords, plant.id, plant.count);
      //               }
      //             }
      //             continue;
      //           }
      //           for (let i = 0; i <= plant.count; i++) {
      //             Plants.generate(coords, plant.id, plant.count);
      //           }
      //         }
      //       }
      //     }
      //   }
      // }
    }
  }
  addPlant(0.99, VanillaBlockID.tallgrass, 0, 32);
  addPlant(0.4, VanillaBlockID.double_plant, 2, 3);
  addPlant(0.8, VanillaBlockID.tallgrass, 2, 8);
  addPlant(0.2, VanillaBlockID.yellow_flower, 0, 5);
  addPlant(0.5, VanillaBlockID.red_flower, 0, 4);
  addPlant(0.2, EForestPlants.FIRONIA, 0, 3, ForestBiomes.FirefliesForest);
  addPlant(0.3, VanillaBlockID.red_mushroom, 0, 3);
  addPlant(0.2, VanillaBlockID.brown_mushroom, 0,  3);
  addPlant(0.1, EForestPlants.ELECTRIC_MUSHROOM, 0, 5);
  addPlant(0.01, EForestPlants.ICE_FLOWER, 0, 3);
}
