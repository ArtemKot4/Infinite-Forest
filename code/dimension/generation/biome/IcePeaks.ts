namespace ForestGeneration {
  let underwater_whitelist = [
    VanillaTileID.air,
    VanillaBlockID.water,
    VanillaBlockID.flowing_water,
  ];
  function generateKelps(x: int, y: int, z: int) {
    if (Math.random() < 0.05) {
      if (underwater_whitelist.includes(World.getBlockID(x, y, z))) {
        for (let i = 0; i <= randomInt(3, 12); i++) {
          World.setBlock(x, y + i, z, VanillaTileID.kelp, 0);
        }
      }
    }
  }
  function generateSeagrass(x: int, y: int, z: int) {
    if (Math.random() < 0.5) {
        for (let i = 0; i <= randomInt(2, 6); i++) {
          if(World.getBlockID(x + i, y + 1, z + i) !== VanillaBlockID.dirt) continue;
          World.setBlock(x + i, y + 1, z + i, VanillaBlockID.seagrass, 0);
          World.setBlock(x + i, y + 1, z - i, VanillaBlockID.seagrass, 0);
          World.setBlock(x - i, y + 1, z + i, VanillaBlockID.seagrass, 0);
          World.setBlock(x - i, y + 1, z - i, VanillaBlockID.seagrass, 0);
        }
    }
  }

  export function generationReliefPeaks(coords: Vector, x: int, z: int) {
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
        generateKelps(x, BOTTOM_HEIGHT + 1, z);
        generateSeagrass(x, BOTTOM_HEIGHT, z);
      }
    }
  }
}
