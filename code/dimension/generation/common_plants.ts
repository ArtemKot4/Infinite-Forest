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
    for (let i = 0; i <= 24; i++) {
      let coords = GenerationUtils.randomCoords(chunkX, chunkZ);
      coords = GenerationUtils.findSurface(coords.x, 90, coords.z);
      if (coords.y > 54) {
        for (const plant of plants) {
          if (Math.random() > plant.chance) {
            if (plant.biome) {
              if (World.getBiome(coords.x, coords.z) === plant.biome.getID()) {
                for (let i = 0; i <= plant.count; i++) {
                  Plants.generate(coords, plant.id, plant.count);
                }
              };
              continue;
            };
            for (let i = 0; i <= plant.count; i++) {
              Plants.generate(coords, plant.id, plant.count);
            }
          }
        }
      }
    }
  }
  addPlant(0.94, VanillaBlockID.tallgrass, 0, 3);
  addPlant(0.9, VanillaBlockID.double_plant, 0, 16);
  addPlant(0.9, VanillaBlockID.double_plant, 1, 16);
  addPlant(0.8, VanillaBlockID.tallgrass, 2, 8);
  addPlant(0.8, VanillaBlockID.yellow_flower, 0, 8);
  addPlant(0.8, VanillaBlockID.red_flower, 0, 8);
}
