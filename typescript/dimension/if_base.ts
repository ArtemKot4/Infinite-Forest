
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


var InfiniteForest = new Dimensions.CustomDimension("infinite_forest", 75);

//InfiniteForest.setFogColor(-255, 26, 151);
InfiniteForest.setSkyColor(0.4, 0.4, 0.5);

const generator = Dimensions.newGenerator({
  layers: [
    {
      minY: 2,
      maxY: 75,
      yConversion: [[0, 0]],
      material: { base: 9 },
    },
    {
      minY: 0,
      maxY: 82,
      yConversion: [
        [0.7, 1],
        [1, -0.5],
      ],
      material: { base: 1, surface: { id: 3, data: 0, width: 3 }, cover: 2 },
      noise: {
        octaves: { count: 4, scale: 20 },
      },
    },
    {
      minY: 2,
      maxY: 4,
      yConversion: [[0.7, 1]],
      material: { base: 7 },
    },
  ],
});
InfiniteForest.setGenerator(generator);

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



Callback.addCallback("CustomDimensionTransfer", function () {
  if(Player.getDimension() == InfiniteForest.id){World.setWorldTime(13000);
    Commands.exec("/gamerule doDaylightCycle false")
    
  }else{
    
    Commands.exec("/gamerule doDaylightCycle true")
  }
})
