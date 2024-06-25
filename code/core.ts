IMPORT("BlockAnimator");

type int = number;
type universal = string | number;
type name = string;

const AIR = 0;

const Mistical = new Sound("Light.ogg");
const Opening = new Sound("Opening.ogg");

const BLOCK_TYPE_FIRE = Block.createSpecialType({
  solid: false,
  lightlevel: 5,
  rendertype: 1,
  translucency: 0,
  lightopacity: 0,
  destroytime: 0,
  renderlayer: 3,
  sound: "grass",
});

const BLOCK_TYPE_ELECTRIC = Block.createSpecialType({
  solid: false,
  lightlevel: 3,
  renderlayer: 3,
  translucency: 0,
  lightopacity: 0,
  destroytime: 0,
  rendertype: 1,
  sound: "grass",
});

const BLOCK_TYPE_PLANT = Block.createSpecialType({
  solid: false,
  renderlayer: 3,
  translucency: 0,
  lightopacity: 0,
  destroytime: 0,
  rendertype: 1,
  sound: "grass",
});

const BLOCK_TYPE_TORCH = Block.createSpecialType({
  lightlevel: 15,
  sound: "wood",
});

const BLOCK_TYPE_ICED_TORCH = Block.createSpecialType({
  lightlevel: 6,
});

const BLOCK_TYPE_PRINT = Block.createSpecialType({
  lightlevel: 10,
  sound: "glass",
  destroytime: -1,
});
/**
 * Функция для получения массива с числами от min до max
 * @min первое число
 * @max последнее число
 * @возвращает [min, ... ,max]
 */
function range(min: int, max: int): int[] {
  const arr = [];
  for (let i = min; i <= max; i++) {
    arr.push(i);
  }
  return arr;
}

function getFour(id, coords, player) {
  const block = BlockSource.getDefaultForActor(player).getBlock(
    coords.x,
    coords.y,
    coords.z
  );
  // if()
}

/**
 * __ dir __ + resources/models/
 */
const MODELSDIR: string = __dir__ + "resources/assets/models/";

//excludes functions of js

const ObjectValues = function (obj) {
  return Object.keys(obj).map(function (v) {
    return obj[v];
  });
};

/**
 * ObjectAssign -> реализация недостающего метода Object.assign
 * @include объект для дополнения
 * @objs объекты для слияния
 * @возвращает include
 */
function ObjectAssign(include: {}, ...objs: {}[]) {
  for (const a in objs) {
    let ik = Object.keys(objs[a]);
    const kk = ObjectValues(objs[a]);
    for (const i in ik) {
      for (const k in kk) {
        include[ik[i]] = kk[i];
      }
    }
  }
  return include;
}

/**
 * Функция для постановки интервала выполнения чего-либо в тиках
 * @func функция
 * @time время в тиках
 */
function setTickInterval(func: (...any) => any, time: int) {
  if (World.getThreadTime() % time == 0) {
    return func();
  }
}

const tick = (time) => World.getThreadTime() % time == 0;
const sec = (sec) => tick(20 * sec);

const MathHelper = {
  randomValue(...values: any[]): any {
    return values[Math.floor(Math.random() * values.length)];
  },
  randomValueFromArray<T>(values: T[]): T {
    return values[Math.floor(Math.random() * values.length)];
  },
  radian(gradus: int): int {
    return (gradus * Math.PI) / 180;
  },
};

interface IParticleSenderDescriptor {
  type: int;
  x: int;
  y: int;
  z: int;
  vx: int;
  vy: int;
  vz: int;
}

Network.addClientPacket(
  "infinite_forest.particles",
  (packetData: IParticleSenderDescriptor) => {
    Particles.addParticle(
      packetData.type,
      packetData.x,
      packetData.y,
      packetData.z,
      packetData.vx,
      packetData.vy,
      packetData.vz
    );
  }
);

function breakBlockIfAir(id: int) {
  Block.registerNeighbourChangeFunctionForID(
    id,
    (coords, block, changedCoords, region) => {
      if (
        region.getBlockId(coords.x, coords.y - 1, coords.z) === 0 &&
        block.data === 0
      ) {
        region.destroyBlock(coords.x, coords.y, coords.z, true);
      }
    }
  );
}