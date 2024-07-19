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
          generationSnowLayers(chunkX, chunkZ);
        }
      );
}