namespace ForestGeneration {
//  ForestBiomes.WinterForest.addStructure("winter_tree_dc", 0, 0);
  export function generationSnowLayers(coords: Vector, x: int, z: int) {
    if (World.getBiome(x, z) === ForestBiomes.WinterForest.getID()) {
      if (
        World.getBlock(coords.x, coords.y, coords.z).id === VanillaBlockID.grass
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
  ForestBiomes.WinterForest.biome.setTemperatureAndDownfall(0.25, 0.6)
}
