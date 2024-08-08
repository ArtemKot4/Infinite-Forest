namespace ForestGeneration {
  export function generateSnowLayers(coords: Vector, x: int, z: int) {
    if (
      World.getBiome(coords.x, coords.z) === ForestBiomes.WinterForest.id
    ) {
      if (
        World.getBlockID(coords.x, coords.y, coords.z) ===
          VanillaBlockID.grass &&
        World.getBlockID(coords.x, coords.y + 1, coords.z) === VanillaTileID.air
      ) {
       return World.setBlock(coords.x, coords.y + 1, coords.z, VanillaBlockID.snow_layer, 0);
      }
    }
  }
  // ForestBiomes.WinterForest.biome.setTemperatureAndDownfall(0.25, 0.6)
  ForestBiomes.WinterForest.loadStructure("winter_tree");
}
