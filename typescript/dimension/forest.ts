function randomInt(min, max) {
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

  spawnParticle(glowworm, coords.x + x, coords.y + y, coords.z + z, xV, yV, zV);
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

  spawnParticle(glowworm, coords.x + x, coords.y + y, coords.z + z, xV, yV, zV);
  //fire
}

const InventorySaver = {};

const inventSaverFunc = (dimension, player) => {
  const actor = new PlayerActor(player);
  if (InventorySaver && !InventorySaver[player]) {
    ObjectAssign(InventorySaver, {
      [player]: { [dimension]: { items: [] } },
    });
    alert(JSON.stringify(InventorySaver));
    for (let i = 0; i <= 35; i++) {
      InventorySaver[player][dimension]["items"].push(
        actor.getInventorySlot(i).id
      );
      alert(JSON.stringify(InventorySaver));
      actor.setInventorySlot(i, 0, 0, 0, null);
    }
  }
};

let time = 0;

Callback.addCallback("PlayerChangedDimension", function (playerUid, from, to) {
  if (Entity.getDimension(playerUid) == InfiniteForest.id) {
  Updatable.addLocalUpdatable(InfiniteTick())
  time = World.getWorldTime();
    World.setWorldTime(42000);
    Commands.exec("/gamerule doDaylightCycle false");
  } else {
   // inventSaverFunc(EDimension.NORMAL, playerUid);
    Commands.exec("/gamerule doDaylightCycle true");
    World.setWorldTime(time);
  }
});