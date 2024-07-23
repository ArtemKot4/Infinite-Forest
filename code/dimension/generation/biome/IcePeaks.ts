namespace ForestGeneration {
  export function generationReliefPeaks(coords: Vector, x: int, z: int) {
    if (World.getBiome(x, z) === ForestBiomes.IcePeaks.getID()) {
      if (
        World.getBlock(x, coords.y, z).id === VanillaBlockID.grass
      ) {
        if (Math.random() < 0.4) {
          World.setBlock(
            coords.x,
            coords.y + 1,
            coords.z,
            VanillaBlockID.snow_layer,
            0
          );
        };
        for (let ice_height = 0; ice_height <= 4; ice_height++) {
          World.setBlock(
            x,
            coords.y - ice_height,
            z,
            VanillaBlockID.ice,
            0
          );
        }
        for (let ocean_height = 5; ocean_height <= 20; ocean_height++) {
          World.setBlock(
            x,
            coords.y - ocean_height,
            z,
            VanillaBlockID.flowing_water,
            0
          );
        }
        let bottom_block = VanillaBlockID.dirt;
        if (Math.random() < 0.2) {
          bottom_block = VanillaBlockID.magma;
        }
        World.setBlock(
          x,
          coords.y - 21,
          z,
          bottom_block,
          0
        );
      }
    }
  }
}
