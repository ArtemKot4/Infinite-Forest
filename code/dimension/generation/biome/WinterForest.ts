namespace ForestGeneration {
    ForestBiomes.WinterForest.addStructure("pink_tree", 1, 1);
    export function generationSnowLayers(chunkX: int, chunkZ: int) {
        for (let x = chunkX * 16; x < (chunkX + 1) * 16; x++) {
            for (let z = chunkZ; z < (chunkZ + 1) * 16; z++) {
              const coords = GenerationUtils.findSurface(x, 90, z);
              if (World.getBiome(x, z) === ForestBiomes.WinterForest.getID()) {
                if (
                  World.getBlock(coords.x, coords.y, coords.z).id ===
                  VanillaBlockID.grass
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
            }
          };
          return;
    }
}