namespace ForestGeneration {
 ForestBiomes.WinterForest.addStructure("winter_tree", 0, 0);
  export function generationSnowLayers(coords: Vector, x: int, z: int) {
    if (World.getBiome(x, z) === ForestBiomes.WinterForest.getID()) {
      if (
        World.getBlockID(coords.x, coords.y, coords.z) === VanillaBlockID.grass
      ) {
        World.setBlock(
          coords.x,
          coords.y + 1,
          coords.z,
          VanillaBlockID.snow_layer,
          0
        );
        return;
      }
    }
  };
 // ForestBiomes.WinterForest.biome.setTemperatureAndDownfall(0.25, 0.6)
}
