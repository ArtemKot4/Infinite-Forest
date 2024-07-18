function randomInt(min: int, max: int) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//var Particles = ModAPI.requireGlobal("Particles");

function getSign(n) {
  if (n > 0) return 1;
  if (n == 0) return 0;
  if (n < 0) return -1;
}
function random(min, max) {
  var rnd = Math.random();
  var dot = getSign(Math.random() * 2 - 1);
  return Math.floor(rnd * (max - min) * dot + min * dot);
}
function getMinDistance(min, max) {
  var x = random(0, max);
  var z = random(0, max);
  if (x * x + z * z > min * min) {
    return { x: x, z: z };
  } else {
    return getMinDistance(min, max);
  }
}

function addFire(coords) {
  var xz = getMinDistance(10, 30);
  var x = xz.x;
  var y = random(0, 1);
  var z = xz.z;
  var xz = getMinDistance(3, 5);
  ForestParticle.send(
    EParticleType.FLAME,
    coords.x + x,
    coords.y + y,
    coords.z + z,
    0.03,
    0.03,
    0,
    Player.getLocal()
  );
}
function addGlowworm(coords) {
  var xz = getMinDistance(30, 80);
  var x = xz.x;
  var y = random(0, 1);
  var z = xz.z;
  var xz = getMinDistance(3, 5);
  var xV = xz.x / 80;
  var yV = random(3, 5) / 600;
  var zV = xz.z / 80;

  ForestParticle.send(
    glowworm,
    coords.x + x,
    coords.y + y,
    coords.z + z,
    xV,
    yV,
    zV,
    Player.getLocal()
  );
  //fire
}

let time = 0;

Callback.addCallback("PlayerChangedDimension", function (playerUid, from, to) {
  if (Entity.getDimension(playerUid) == InfiniteForest.id) {
    time = World.getWorldTime();
    World.setWorldTime(42000);
    Commands.exec("/gamerule doDaylightCycle false");
  } else {
    // inventSaverFunc(EDimension.NORMAL, playerUid);
    Commands.exec("/gamerule doDaylightCycle true");
    World.setWorldTime(time);
  }
});

namespace Plants {
  export function generate(coords: Vector, id: int, data?: int) {
    if (
      World.getBlockID(coords.x, coords.y, coords.z) === VanillaBlockID.grass &&
      World.getBlockID(coords.x, coords.y + 1, coords.z) === 0
    ) {
      return World.setBlock(coords.x, coords.y + 1, coords.z, id, data || 0);
    }
  }
}

namespace ForestGeneration {
  export function generatePlants(chunkX: number, chunkZ: number) {
    for (let i = 0; i <= 24; i++) {
      let coords = GenerationUtils.randomCoords(chunkX, chunkZ);
      coords = GenerationUtils.findSurface(coords.x, 90, coords.z);
      if (coords.y > 54) {
        if (Math.random() > 0.94) {
          Plants.generate(coords, VanillaBlockID.tallgrass);
        }
        if (Math.random() > 0.9) {
          for (let i = 0; i <= 16; i++) {
            Plants.generate(coords, VanillaBlockID.double_plant);
          }
        }
        if (Math.random() > 0.9) {
          for (let i = 0; i <= 16; i++) {
            Plants.generate(coords, VanillaBlockID.double_plant, 1);
          }
        }
        if (Math.random() > 0.8) {
          for (let i = 0; i <= 8; i++) {
            Plants.generate(coords, VanillaBlockID.tallgrass, 2);
          }
        }

        if (Math.random() > 0.8) {
          for (let i = 0; i <= 8; i++) {
            Plants.generate(coords, VanillaBlockID.yellow_flower);
          }
        }
        if (Math.random() > 0.8) {
          for (let i = 0; i <= 8; i++) {
            Plants.generate(coords, VanillaBlockID.red_flower);
          }
        }
      }
    }
  }

  export function generateGroundCavesBlock(chunkX: number, chunkZ: number) {
    const cavesBlock_1 = MathHelper.randomValue(
      VanillaBlockID.cobblestone,
      VanillaBlockID.gravel,
      VanillaBlockID.mossy_cobblestone
    );
    const cavesBlock_2 = MathHelper.randomValue(
      VanillaBlockID.lapis_ore,
      VanillaBlockID.coal_ore,
      VanillaBlockID.air,
      VanillaBlockID.dirt,
      VanillaBlockID.red_sandstone
    );
    for (let i = 0; i < 128; i++) {
      let coords = GenerationUtils.randomCoords(chunkX, chunkZ);
      coords = GenerationUtils.findSurface(coords.x, 127, coords.z);
      if (
        coords.y >= 45 &&
        World.getBlockID(coords.x, coords.y, coords.z) === VanillaBlockID.stone
      ) {
        if (Math.random() < 0.5) {
          World.setBlock(coords.x, coords.y, coords.z, cavesBlock_1, 0);
        } else {
          World.setBlock(coords.x, coords.y, coords.z, cavesBlock_2, 0);
          if (cavesBlock_2 === VanillaBlockID.red_sandstone) {
            if (Math.random() < 0.4) {
              World.setBlock(
                coords.x,
                coords.y + 1,
                coords.z,
                EForestPlants.FIRONIA,
                0
              );
              return;
            }
            if (Math.random() < 0.6) {
              Vine.generateOn(randomInt(3, 24), coords, FLAME_VINE);
              return;
            }
          }
        }
      }
    }
  }

  export function generateWaterUnderground(chunkX: number, chunkZ: number) {
    const list = [
      VanillaBlockID.gravel,
      VanillaBlockID.sand,
      VanillaBlockID.clay,
      VanillaBlockID.dirt,
    ];
    const underwater_block_1 = MathHelper.randomValueFromArray(list);
    const underwater_block_2 = MathHelper.randomValueFromArray(list);

    for (let i = 0; i <= 512; i++) {
      let coords = GenerationUtils.randomCoords(chunkX, chunkZ);
      coords = GenerationUtils.findSurface(coords.x, 127, coords.z);
      if (
        coords.y <= 53 &&
        World.getBlockID(coords.x, coords.y, coords.z) === VanillaBlockID.grass
      ) {
        if (Math.random() < 0.94) {
          World.setBlock(coords.x, coords.y, coords.z, underwater_block_1, 0);
          if (
            underwater_block_1 === VanillaBlockID.dirt &&
            Math.random() < 0.1
          ) {
            World.setBlock(
              coords.x,
              coords.y + 1,
              coords.z,
              VanillaBlockID.seagrass,
              0
            );
          }
        } else {
          World.setBlock(coords.x, coords.y, coords.z, underwater_block_2, 0);
        }
      }
    }
  }
  export function generateBlocksInsteadGrass(chunkX: number, chunkZ: number) {
    if (Math.random() < 0.01) {
      const block = MathHelper.randomValue(
        VanillaBlockID.podzol,
        VanillaBlockID.leaves,
        VanillaBlockID.leaves2,
        VanillaBlockID.ice,
        VanillaBlockID.mossy_cobblestone,
        VanillaBlockID.vine,
        VanillaBlockID.mycelium,
        VanillaBlockID.stone,
        VanillaBlockID.gravel
      );
      for (let i = 0; i <= 64; i++) {
        let coords = GenerationUtils.randomCoords(chunkX, chunkZ);
        coords = GenerationUtils.findSurface(coords.x, 90, coords.z);
        if (coords.y <= 54) return;
        if (
          World.getBlockID(coords.x, coords.y, coords.z) ===
          VanillaBlockID.grass
        ) {
          if (block === VanillaBlockID.mycelium && Math.random() < 0.15) {
            const mushroom = MathHelper.randomValue<int>(
              VanillaBlockID.red_mushroom,
              VanillaBlockID.brown_mushroom,
              EForestPlants.ELECTRIC_MUSHROOM
            );
            World.setBlock(coords.x, coords.y + 1, coords.z, mushroom, 0);
          }
          if (block === VanillaBlockID.ice && Math.random() < 0.05) {
            World.setBlock(
              coords.x,
              coords.y + 1,
              coords.z,
              EForestPlants.ICE_FLOWER,
              0
            );
          }
          if (block === VanillaBlockID.podzol && Math.random() < 0.1) {
            World.setBlock(
              coords.x,
              coords.y + 1,
              coords.z,
              VanillaBlockID.sweet_berry_bush,
              randomInt(1, 4)
            );
          }
        }
        World.setBlock(coords.x, coords.y, coords.z, block, 0);
      }
    }
  }

  export function generateBeaches(chunkX: int, chunkZ: int) {
    const block = [
      VanillaBlockID.sand,
      VanillaBlockID.clay,
      VanillaBlockID.gravel,
    ];
    const random = MathHelper.randomValueFromArray(block);
    const coordsX = chunkX * 16;
    const coordsZ = chunkZ * 16;
    for (let gs = 0; gs < 16; gs++) {
      if (
        World.getBlockID(coordsX + gs, 54, coordsZ + gs) ===
        VanillaBlockID.grass
      ) {
        World.setBlock(coordsX + gs, 54, coordsZ + gs, random, 0);
        if (random === VanillaBlockID.sand && Math.random() < 0.05) {
          World.setBlock(
            coordsX + gs,
            54,
            coordsZ + gs,
            VanillaBlockID.deadbush,
            0
          );
        }
      }
    }
  }

  Callback.addCallback(
    "GenerateCustomDimensionChunk",
    function (chunkX, chunkZ, random, dimensionId) {
      if (dimensionId !== InfiniteForest.id) return;
      generateWaterUnderground(chunkX, chunkZ);
      generatePlants(chunkX, chunkZ);
      generateGroundCavesBlock(chunkX, chunkZ);
      generateBlocksInsteadGrass(chunkX, chunkZ);
      generateBeaches(chunkX, chunkZ);
      for (let x = chunkX * 16; x < (chunkX + 1) * 16; x++) {
        for (let z = chunkZ; z < (chunkZ + 1) * 16; z++) {
          const coords = GenerationUtils.findSurface(x, 90, z);
          if (
            World.getBiome(x, z) === ForestBiomes.WinterForest.id &&
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
    }
  );
}

/* //!
      for (let i = 0; i <= 3; i++) {
        let coords = GenerationUtils.randomCoords(chunkX, chunkZ);
        coords = GenerationUtils.findSurface(coords.x, 127, coords.z);
        if (coords.y > 54) {
          if (Math.random() > 0.8) {
            Plants.generate(coords, EForestPlants.FIRONIA);
          }
          if (Math.random() > 0.4) {
            Plants.generate(coords, EForestPlants.ELECTRIC_MUSHROOM);
          }
          if (Math.random() > 0.1) {
            Plants.generate(coords, EForestPlants.ICE_FLOWER);
          }
        }
      }

     

        if (Math.random() < 0.1) {
          for (let i = 0; i <= 16; i++) {
            let coords = GenerationUtils.randomCoords(chunkX, chunkZ);
            coords = GenerationUtils.findSurface(coords.x, 127, coords.z);
            if (
              coords.y === 54 &&
              World.getBlockID(coords.x, coords.y, coords.z) !==
                VanillaBlockID.grass
            ) {
              const ice = MathHelper.randomValue(
                VanillaBlockID.ice,
                VanillaBlockID.blue_ice,
                VanillaBlockID.packed_ice,
                VanillaBlockID.frosted_ice
              );
              World.setBlock(coords.x, coords.y, coords.z, ice, 0);
            }
          }
        }

          if (Math.random() < 0.98) {
          for (let i = 0; i <= 16; ) {
            if (
              World.getBlockID(coords.x, coords.y, coords.z) ===
                VanillaBlockID.grass &&
              World.getBlockID(coords.x, coords.y + 1, coords.z) ===
                VanillaBlockID.water &&
              World.getBlockID(coords.x, coords.y + 2, coords.z) === 0
            ) {
              World.setBlock(
                coords.x,
                coords.y + 1,
                coords.z,
                VanillaBlockID.waterlily,
                0
              );
            }
          }
        } */
