namespace ForestGeneration {
// ForestBiomes.WinterForest.addStructure("winter_tree", 0, 0);
  export function generateSnowLayers(coords: Vector, x: int, z: int) {
    if (World.getBiome(coords.x, coords.z) === ForestBiomes.WinterForest.getID()) {
      if (
        World.getBlockID(x, coords.y, z) === VanillaBlockID.grass
      ) {
        World.setBlock(
          coords.x,
          coords.y + 1,
          coords.z,
          VanillaBlockID.snow_layer,
          0
        );
      }
    }
  };
 // ForestBiomes.WinterForest.biome.setTemperatureAndDownfall(0.25, 0.6)
 ForestBiomes.WinterForest.loadStructure("winter_tree");
}
