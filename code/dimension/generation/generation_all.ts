namespace ForestGeneration {
  Callback.addCallback(
    "GenerateCustomDimensionChunk",
    function (chunkX, chunkZ, random, dimensionId) {
      if (dimensionId !== InfiniteForest.id) return;
      generateWaterUnderground(chunkX, chunkZ);
      generatePlants(chunkX, chunkZ);
      generateGroundCavesBlock(chunkX, chunkZ);
      generateBlocksInsteadGrass(chunkX, chunkZ);
      generateBeaches(chunkX, chunkZ);
      ForestBiomes.HeartForest.generateStructure(
        "winter_forest",
        chunkX,
        chunkZ,
        3,
        5
      );
      ForestBiomes.WinterForest.generateStructure(
        "winter_forest",
        chunkX,
        chunkZ,
        3,
        5
      );
      for (let x = chunkX * 16; x < (chunkX + 1) * 16; x++) {
        for (let z = chunkZ; z < (chunkZ + 1) * 16; z++) {
          generateGreatWall(x, z);
          const coords = GenerationUtils.findSurface(x, 90, z);
          if (coords.y < 54) return;
          generateSnowLayers(coords, x, z);
          generateReliefPeaks(coords, x, z);
        }
      }
    }
  );
}
