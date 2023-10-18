Network.addClientPacket("if.particle", function (packetData: any) {
  Particles.addParticle(
    packetData.p,
    packetData.x,
    packetData.y, 
    packetData.z,
    packetData.vx,
    packetData.vy,
    packetData.vz
  );
});

function spawnParticle(type, x, y, z, vx, vy, vz, ax, ay?, az?) {
  vx = vx || 0;
  vy = vy || 0;
  vz = vz || 0;
  ax = ax || 0;
  ay = ay || 0;
  az = az || 0;
  var players = Network.getConnectedPlayers();
  for (var i in players) {
    var client = Network.getClientForPlayer(players[i]);
    if (client) {
      client.send("if.particle", {
        p: type,
        x: x,
        y: y,
        z: z,
        vx: vx,
        vy: vy,
        vz: vz,
      });
      /*  Debug.message("spawn particle");*/
    } else {
      Debug.message("[Error] Failed spawn particle");
    }
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const UniqueGen = {
  randomCoords: function (random, chunkX, chunkZ, minHeight, maxHeight,z?) {
    minHeight = minHeight || 0;
    maxHeight = maxHeight || 220;
    return {
      x: chunkX * 16 + random.nextInt(16),
      y: random.nextInt(maxHeight - minHeight + 1) - minHeight,
      z: (z = chunkZ * 16 + random.nextInt(16)),
    };
  },
  generateOre: function (id, data, chunkX, chunkZ, random, params) {
    for (let i = 0; i < params.veinCounts; i++) {
      let coords = this.randomCoords(
        random,
        chunkX,
        chunkZ,
        params.minY,
        params.maxY
      );
      GenerationUtils.generateOre(
        coords.x,
        coords.y,
        coords.z,
        id,
        data,
        params.size,
        false,
        random.nextInt()
      );
    }
  },
  generateOreInDimension: function (id, data, chunkX, chunkZ, random, params) {
    for (let i = 0; i < params.veinCounts; i++) {
      let coords = this.randomCoords(
        random,
        chunkX,
        chunkZ,
        params.minY,
        params.maxY
      );
      GenerationUtils.generateOreCustom(
        coords.x,
        coords.y,
        coords.z,
        id,
        data,
        params.size,
        params.mode,
        params.check
      );
    }
  },
};

var InfiniteForest = new Dimensions.CustomDimension("InfiniteForest", 75);

//InfiniteForest.setFogColor(0, .6, .3);
InfiniteForest.setSkyColor(0.4, 0.4, 0.5);

let generator = Dimensions.newGenerator({
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
      if (BlockSource.getDefaultForActor(Player.getLocal()).getBlockId(coords.x, coords.y, coords.z) == 0) {
        World.setBlock(place.x, place.y + 1, place.z, BlockID.fironia, 0);
      }
    }
  }
);

//var Particles = ModAPI.requireGlobal("Particles");

var glowworm = Particles.registerParticleType({
  texture: "part_1",
  render: 2,
  size: [1, 3],
  lifetime: [40, 100],

  animators: {
    alpha: { fadeIn: 0.4, fadeOut: 0.4 },
    size: { fadeOut: 0.5, fadeIn: 0.2, start: 0, end: 0 },
  },
});
var fire = Particles.registerParticleType({
  texture: "part_1",
  render: 2,
  color: [1, 0.5, 0.5, 0.5],
  size: [2, 4],
  lifetime: [40, 100],

  animators: {
    alpha: { fadeIn: 0.4, fadeOut: 0.4 },
    size: { fadeOut: 0.5, fadeIn: 0.2, start: 0, end: 0 },
  },
});

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
    0
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

  spawnParticle(fire, coords.x + x, coords.y + y, coords.z + z, xV, yV, zV, 0);
}

Callback.addCallback("LocalTick", function () {
  let pos = Player.getPosition();
  if (World.getThreadTime()%200&&Player.getDimension() == InfiniteForest.id) {
    addGlowworm(pos);
    for (var i = 0; i < 3; i++) {
      addFire(pos);
    }
  }
 
});

Callback.addCallback("LevelLoaded", function () {
  if(Player.getDimension() == InfiniteForest.id){World.setWorldTime(13300);
    Commands.exec("/gamerule doDaylightCycle false")
  }else{
    
    Commands.exec("/gamerule doDaylightCycle true")
  }
})


// Callback.addCallback("GenerateCustomDimensionChunk", function(chunkX, chunkZ, random, dimensionId, player) {
//  if (dimensionId != InfiniteForest.id) return;
//  UniqueGen.generateOreInDimension(VanillaBlockID.andesite, 0, chunkX, chunkZ, random, {
//  veinCounts: 4,
//  minY:2,
//  maxY: 120,
//  size: randomInt(4, 40),
//  mode: true,
//  check: [VanillaBlockID.stone]
//  });
// });

// Callback.addCallback("GenerateCustomDimensionChunk", function(chunkX, chunkZ, random, dimensionId, player) {
//  if (dimensionId != InfiniteForest.id) return;
//  UniqueGen.generateOreInDimension(VanillaBlockID.diorite, 0, chunkX, chunkZ, random, {
//  veinCounts: 4,
//  minY:2,
//  maxY: 120,
//  size: randomInt(4, 40),
//  mode: true,
//  check: [VanillaBlockID.stone]
//  });
// });

// Callback.addCallback("GenerateCustomDimensionChunk", function(chunkX, chunkZ, random, dimensionId, player) {
//  if (dimensionId != InfiniteForest.id) return;
//  UniqueGen.generateOreInDimension(VanillaBlockID.granite, 0, chunkX, chunkZ, random, {
//  veinCounts: 4,
//  minY:2,
//  maxY: 120,
//  size: randomInt(4, 40),
//  mode: true,
//  check: [VanillaBlockID.stone]
//  });
// });


ModAPI.addAPICallback("ICore", function (api) {
  Callback.addCallback(
    "GenerateCustomDimensionChunk",
    function (chunkX, chunkZ, random, dimensionId, player) {
      if (dimensionId != InfiniteForest.id) return;
      UniqueGen.generateOreInDimension(
        BlockID.oreCopper,
        0,
        chunkX,
        chunkZ,
        random,
        {
          veinCounts: 3,
          minY: 2,
          maxY: 60,
          size: randomInt(1, 9),
          mode: true,
          check: [VanillaBlockID.stone],
        }
      );

      Callback.addCallback(
        "GenerateCustomDimensionChunk",
        function (chunkX, chunkZ, random, dimensionId, player) {
          if (dimensionId != InfiniteForest.id) return;
          UniqueGen.generateOreInDimension(
            BlockID.oreTin,
            0,
            chunkX,
            chunkZ,
            random,
            {
              veinCounts: 3,
              minY: 2,
              maxY: 50,
              size: randomInt(1, 6),
              mode: true,
              check: [VanillaBlockID.stone],
            }
          );
        }
      );

      Callback.addCallback(
        "GenerateCustomDimensionChunk",
        function (chunkX, chunkZ, random, dimensionId, player) {
          if (dimensionId != InfiniteForest.id) return;
          UniqueGen.generateOreInDimension(
            BlockID.oreSilver,
            0,
            chunkX,
            chunkZ,
            random,
            {
              veinCounts: 3,
              minY: 2,
              maxY: 40,
              size: randomInt(1, 5),
              mode: true,
              check: [VanillaBlockID.stone],
            }
          );
        }
      );
      Callback.addCallback(
        "GenerateCustomDimensionChunk",
        function (chunkX, chunkZ, random, dimensionId, player) {
          if (dimensionId != InfiniteForest.id) return;
          UniqueGen.generateOreInDimension(
            BlockID.oreUranium,
            0,
            chunkX,
            chunkZ,
            random,
            {
              veinCounts: 2,
              minY: 2,
              maxY: 40,
              size: randomInt(2, 4),
              mode: true,
              check: [VanillaBlockID.stone],
            }
          );
        }
      );

      Callback.addCallback(
        "GenerateCustomDimensionChunk",
        function (chunkX, chunkZ, random, dimensionId, player) {
          if (dimensionId != InfiniteForest.id) return;
          UniqueGen.generateOreInDimension(
            BlockID.oreIridium,
            0,
            chunkX,
            chunkZ,
            random,
            {
              veinCounts: 2,
              minY: 2,
              maxY: 40,
              size: randomInt(2, 4),
              mode: true,
              check: [VanillaBlockID.stone],
            }
          );
        }
      );
    }
  );
});

ModAPI.addAPICallback("SpacesAPI", function (api) {
  Callback.addCallback(
    "GenerateCustomDimensionChunk",
    function (chunkX, chunkZ, random, dimensionId, player) {
      if (dimensionId != InfiniteForest.id) return;
      UniqueGen.generateOreInDimension(
        BlockID.ore_copper_sc,
        0,
        chunkX,
        chunkZ,
        random,
        {
          veinCounts: 3,
          minY: 2,
          maxY: 60,
          size: randomInt(2, 7),
          mode: true,
          check: [VanillaBlockID.stone],
        }
      );
    }
  );

  Callback.addCallback(
    "GenerateCustomDimensionChunk",
    function (chunkX, chunkZ, random, dimensionId, player) {
      if (dimensionId != InfiniteForest.id) return;
      UniqueGen.generateOreInDimension(
        BlockID.ore_tin_sc,
        0,
        chunkX,
        chunkZ,
        random,
        {
          veinCounts: 3,
          minY: 2,
          maxY: 60,
          size: randomInt(2, 4),
          mode: true,
          check: [VanillaBlockID.stone],
        }
      );
    }
  );

  Callback.addCallback(
    "GenerateCustomDimensionChunk",
    function (chunkX, chunkZ, random, dimensionId, player) {
      if (dimensionId != InfiniteForest.id) return;
      UniqueGen.generateOreInDimension(
        BlockID.ore_aluminum_sc,
        0,
        chunkX,
        chunkZ,
        random,
        {
          veinCounts: 3,
          minY: 2,
          maxY: 60,
          size: randomInt(2, 7),
          mode: true,
          check: [VanillaBlockID.stone],
        }
      );
    }
  );
});
