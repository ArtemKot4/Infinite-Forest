namespace ForestGeneration {
  Callback.addCallback(
    "GenerateCustomDimensionChunk",
    function (chunkX, chunkZ, random, dimensionId) {
      if (dimensionId !== InfiniteForest.id) return;
      ForestBiomes.FirefliesForest.generateStructure(
        "eucalyptus_tree_0",
        chunkX,
        chunkZ,
        3,
        0.94
      ),
        ForestBiomes.FirefliesForest.generateStructure(
          "pink_tree_0",
          chunkX,
          chunkZ,
          3,
          0.84
        );
      ForestBiomes.WinterForest.generateStructure(
        "winter_tree",
        chunkX,
        chunkZ,
        3,
        0.9
      );
      for (let x = chunkX * 16; x < (chunkX + 1) * 16; x++) {
        for (let z = chunkZ; z < (chunkZ + 1) * 16; z++) {
          generateGreatWall(x, z);
          const coords = GenerationUtils.findSurface(x, 90, z);
          // generateBeaches(coords);
          if (coords.y < 54) return;
          // generateSnowLayers(coords, x, z);
          //  generateReliefPeaks(coords, x, z);
        }
      }
      generateWaterUnderground(chunkX, chunkZ);
      generateGroundCavesBlock(chunkX, chunkZ);
      generateBlocksInsteadGrass(chunkX, chunkZ);
      generatePlants(chunkX, chunkZ);
      return;
    }
  );
}

//TODO: DELETE DEBUG
Item.registerUseFunctionForID(
  ItemID["pink_stick"],
  (coords, item, block, player) => {
    alert("yes");
    const random = MathHelper.randomValue(
      "winter_tree",
      "pink_tree_0",
      "eucalyptus_tree_0"
    );
    Structure.set(
      ForestStructurePool.get(random),
      coords.x,
      coords.y + 1,
      coords.z,
      BlockSource.getDefaultForDimension(InfiniteForest.id)
    );
    Game.message(JSON.stringify(Curse.getStatelist()));
    return;
  }
);
