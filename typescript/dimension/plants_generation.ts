Callback.addCallback(
  "GenerateCustomDimensionChunk",
  function (chunkX, chunkZ, random, dimensionId) {
    //base by Dans2
    if (dimensionId != InfiniteForest.id) return;

    if (Math.random() < 0.9) {
      let coords = GenerationUtils.randomCoords(chunkX, chunkZ);
      coords = GenerationUtils.findSurface(coords.x, 127, coords.z);
      if (coords.y < 33) return;
      for (let i = 0; i < randomInt(5, 11); i++) {
        if (
          World.getBlockID(coords.x, coords.y, coords.z) ==
          VanillaBlockID.grass
        ) {
          World.setBlock(
            coords.x,
            coords.y + 1,
            coords.z,
            VanillaBlockID.tallgrass,
            0
          );
        }
      }
    }
  }
);
