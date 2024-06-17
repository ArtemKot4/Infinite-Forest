function randomInt(min: int, max: int) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

Callback.addCallback(
  "GenerateCustomDimensionChunk",
  function (chunkX, chunkZ, random, dimensionId, block, id, crds) {
    if (dimensionId != InfiniteForest.id) return;
    let place = GenerationUtils.randomCoords(chunkX, chunkZ);
    let coords = GenerationUtils.findSurface(crds.x, 128, crds.z);
    if (coords.y < 32) return;

    Forest.setupPlant({
      coords,
      place,
      id: BlockID["fironia"],
      random: [5, 10],
    });

    Forest.setupPlant({
      coords,
      place,
      id: VanillaBlockID.tallgrass,
      random: [5, 20],
    });
  }
);

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

function addGlowworm(coords) {
  var xz = getMinDistance(10, 30);
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
}
function addFire(coords) {
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
  export function generate(coords: Vector, count: int, id: int, data?: int) {
    for (let i = 0; i <= count; i++) {
      if (
        World.getBlockID(coords.x, coords.y, coords.z) ===
          VanillaBlockID.grass &&
        World.getBlockID(coords.x, coords.y + 1, coords.z) !==
          VanillaTileID.water
      ) {
        return World.setBlock(coords.x, coords.y + 1, coords.z, id, data || 0);
      }
    }
  }
}

namespace ForestGeneration {
  Callback.addCallback(
    "GenerateCustomDimensionChunk",
    function (chunkX, chunkZ, random, dimensionId) {
      if (dimensionId !== InfiniteForest.id) return;
      var coords = GenerationUtils.randomCoords(chunkX, chunkZ);
      coords = GenerationUtils.findSurface(coords.x, 127, coords.z);
      if (coords.y < 33) return;
      for (var i = 0; i < 24; i++) {
        if (Math.random() < 0.99) {
          Plants.generate(coords, 24, VanillaBlockID.tallgrass);
        }
        if (Math.random() < 0.9) {
          Plants.generate(coords, 2, VanillaBlockID.double_plant);
        }
        if (Math.random() < 0.9) {
          Plants.generate(coords, 8, VanillaBlockID.double_plant, 2);
        }
        if (Math.random() < 0.7) {
          Plants.generate(coords, 6, EForestPlants.FIRONIA);
        }

        if (Math.random() < 0.9) {
          Plants.generate(coords, 6, VanillaBlockID.yellow_flower);
        }
        if (Math.random() < 0.9) {
          Plants.generate(coords, 6, VanillaBlockID.red_flower);
        }
        if (Math.random() < 0.9) {
          Plants.generate(coords, 16, VanillaBlockID.tallgrass, 2);
        }
      /*  if (Math.random() < 0.98) {
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
      }
    }
  );
}
