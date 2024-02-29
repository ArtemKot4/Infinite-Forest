
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


Callback.addCallback(
  "GenerateCustomDimensionChunk",
  function (chunkX, chunkZ, random, dimensionId, block, id, coords) {
    if (dimensionId != InfiniteForest.id) return;
    let place = GenerationUtils.randomCoords(chunkX, chunkZ);
    coords = GenerationUtils.findSurface(coords.x, 128, coords.z);
    if (coords.y < 32) return;
    for (let i = 0; i < randomInt(2, 3); i++) {
      if (BlockSource.getDefaultForActor(Player.getLocal()).getBlockId(coords.x, coords.y+1, coords.z) == 0) {
        World.setBlock(place.x, place.y + 1, place.z, BlockID.fironia, 0);
      }
    }
  }
);

Callback.addCallback(
  "GenerateCustomDimensionChunk",
  function (chunkX, chunkZ, random, dimensionId, block, id, coords) {
    if (dimensionId != InfiniteForest.id) return;
    let place = GenerationUtils.randomCoords(chunkX, chunkZ);
    coords = GenerationUtils.findSurface(coords.x, 128, coords.z);
    if (coords.y < 32) return;
    for (let i = 0; i < randomInt(2, 1); i++) {
      if (BlockSource.getDefaultForActor(Player.getLocal()).getBlockId(coords.x, coords.y+1, coords.z) == 0) {
        World.setBlock(place.x, place.y + 1, place.z, VanillaBlockID.tallgrass, 0);
      }
    }
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

  spawnParticle(
    glowworm,
    coords.x + x,
    coords.y + y,
    coords.z + z,
    xV,
    yV,
    zV,
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

  spawnParticle(glowworm, coords.x + x, coords.y + y, coords.z + z, xV, yV, zV);
  //fire
}

const InventorySaver = {
}

const inventSaverFunc = (dimension, player) => { 
  const saver = InventorySaver
const actor = new PlayerActor(player);
if(InventorySaver && !saver[player]){
  InventorySaver[player] = {};
   saver[player][dimension] = {items: []} } else
   saver[player][dimension].items = [];
for(let i = 0; i <= 35; i++){
   saver[player].items.push(actor.getInventorySlot(i).id);
   Game.message(JSON.stringify(saver[player][dimension]["items"]))
   actor.setInventorySlot(i, 0, 0, 0, null)
}; 
};

Callback.addCallback("PlayerChangedDimension", function (playerUid, from, to) {
 
  if(Entity.getDimension(playerUid) == InfiniteForest.id){
   inventSaverFunc(InfiniteForest.id, playerUid)
    World.setWorldTime(42000);
    Commands.exec("/gamerule doDaylightCycle false")
    
  } else {
    inventSaverFunc(EDimension.NORMAL, playerUid)
    Commands.exec("/gamerule doDaylightCycle true")
  }
})

