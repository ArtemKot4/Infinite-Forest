namespace ForestGeneration {
  Callback.addCallback(
    "GenerateCustomDimensionChunk",
    function (chunkX, chunkZ, random, dimensionId) {
      if (dimensionId !== InfiniteForest.id) return;
      for (let i in ForestBiomes.ForestBiome.chunkStructures) {
        let index = ForestBiomes.ForestBiome.chunkStructures[i];
        ForestBiomes.ForestBiome.generateStructure(
          i,
          chunkX,
          chunkZ,
          index.biome,
          index.count,
          index.chance,
          index.cover_block
        );
      }
      // ForestBiomes.FirefliesForest.generateStructure(
      //   Math.random() < 0.1 ? "eucalyptus_tree_1" : "eucalyptus_tree_0",
      //   chunkX,
      //   chunkZ,
      //   3,
      //   0.94
      // ),
      //   ForestBiomes.FirefliesForest.generateStructure(
      //     Math.random() < 0.1 ? "pink_tree_1" : "pink_tree_0",
      //     chunkX,
      //     chunkZ,
      //     3,
      //     0.84
      //   );
      // ForestBiomes.WinterForest.generateStructure(
      //   "winter_tree",
      //   chunkX,
      //   chunkZ,
      //   3,
      //   0.9
      // );
      for (let x = chunkX * 16; x < (chunkX + 1) * 16; x++) {
        for (let z = chunkZ; z < (chunkZ + 1) * 16; z++) {
        //  generateGreatWall(x, z);
          const coords = GenerationUtils.findSurface(x, 90, z);
          generateBeaches(coords);
          if (coords.y > 54) {
          //  generateSnowLayers(coords, x, z);
            //  generateReliefPeaks(coords, x, z);
          }
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
    // const random = MathHelper.randomValue(
    //   "winter_tree",
    //   "pink_tree_0",
    //   "eucalyptus_tree_0"
    // );
    // Structure.set(
    //   ForestStructurePool.get(random),
    //   coords.x,
    //   coords.y + 1,
    //   coords.z,
    //   BlockSource.getDefaultForActor(player)
    // );
    Game.message(JSON.stringify(Curse.getStatelist()));
    const random = MathHelper.randomValue([10, 10], [5, 10], [10, 5]);
    return ForestGeneration.placeColumn(
      { id: BlockID["salt"], data: 0 },
      coords,
      random[0],
      random[1]
    );
  }
);

