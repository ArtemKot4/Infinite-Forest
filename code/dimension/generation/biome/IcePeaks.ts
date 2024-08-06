namespace ForestGeneration {


  export function generateReliefPeaks(coords: Vector, x: int, z: int) {
    if (World.getBiome(x, z) === ForestBiomes.IcePeaks.getID()) {
      if (World.getBlock(x, coords.y, z).id === VanillaBlockID.grass) {
        const BOTTOM_HEIGHT = coords.y - 36;
        if (Math.random() < 0.85) {
          World.setBlock(
            coords.x,
            coords.y + 1,
            coords.z,
            VanillaBlockID.snow_layer,
            0
          );
        }
        for (let ice_height = 0; ice_height <= 4; ice_height++) {
          World.setBlock(x, coords.y - ice_height, z, VanillaBlockID.ice, 0);
        }
        for (let ocean_height = 5; ocean_height <= 55; ocean_height++) {
          World.setBlock(
            x,
            coords.y - ocean_height,
            z,
            VanillaBlockID.flowing_water,
            0
          );
        }
        let bottom_block = VanillaBlockID.dirt;
        if (Math.random() < 0.03) {
          bottom_block = VanillaBlockID.magma;
        } else if (Math.random() < 0.07) {
          bottom_block = MathHelper.randomValue(
            VanillaBlockID.frosted_ice,
            VanillaBlockID.sand,
            VanillaBlockID.gravel,
            VanillaBlockID.clay,
            VanillaBlockID.packed_ice
          );
        } else if (Math.random() < 0.03) {
          bottom_block = VanillaBlockID.prismarine;
        }
        World.setBlock(x, BOTTOM_HEIGHT, z, bottom_block, 0);
        generateKelps(x, BOTTOM_HEIGHT + 1, z, randomInt(1, 10));
        generateSeagrass(x, BOTTOM_HEIGHT, z);
      }
    }
  }
}
