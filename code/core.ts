IMPORT("BlockEngine");
IMPORT("ItemAnimHelper");
IMPORT("RenderUtil");
IMPORT("BlockAnimator");
IMPORT("ConnectedTexture");
IMPORT("SoundLib");


const ERROR_WARNING =
  "Error! please send issue on https://github.com/Artem0n4/Infinite-Forest";

type int = number;
type universal = string | number;
type name = string;

const AIR = 0;

const SoundContainer = {
  //book_writing: new Sound("book_writing")
};
// const Mistical = new Sound("Light.ogg");
// const Opening = new Sound("Opening.ogg");

/** __ dir __ + "resources/structures/";
 *
 */
const structureDIR = __dir__ + "resources/structures/";
const ForestStructurePool = new StructurePool("infinite_forest_structure_pool");

const BLOCK_TYPE_GLASS = Block.createSpecialType({
  explosionres: 0.5,
  lightopacity: 1,
  destroytime: 60,
  renderlayer: 1,
  sound: "glass"
});

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

const BLOCK_TYPE_TRANSLURENT = Block.createSpecialType({
  destroytime: 0,
  explosionres: 0,
  translucency: 1,
  material: 4
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

/**
 * __ dir __ + resources/models/
 */
const MODELSDIR: string = __dir__ + "resources/assets/models/";

const MathHelper = {
  randomValue<T>(...values: T[]): T {
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

function breakHasAir(id: int) {
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

function parseID(id: string) {
  return ItemID[id] || VanillaItemID[id] || BlockID[id] || VanillaBlockID[id];
}

enum EForestState {
  ICE = -1,
  BALANCE = 0,
  FIRE = 1,
}

const ForestConfiguration = {};

function randomizeHotbarSlot(player) {
  const randomSlot = randomInt(0, 8);
  const actor = new PlayerEntity(player);
  actor.setSelectedSlot(randomSlot);
  actor.setCarriedItem(actor.getInventorySlot(actor.getSelectedSlot()));
  return;
}

function iceItemProtectFunction(player) {
  if (ColdCurse.allowHas(player)) {
    randomizeHotbarSlot(player);
    Entity.damageEntity(player, 3);
  }
}

const ServerPlayerDamage = (count: int = 1) =>
  Network.sendToServer("infinite_forest.damage_player", { count: count });

Network.addServerPacket(
  "infinite_forest.damage_player",
  (client, data: { count: int }) => {
    const player = client.getPlayerUid();
    const actor = new PlayerActor(player);
    if (actor.getGameMode() === EGameMode.CREATIVE) return;
    return Entity.damageEntity(client.getPlayerUid(), data.count || 1);
  }
);

namespace PlayerHelper {
  export const getPointed = ModAPI.requireGlobal("Player.getPointed") as () => {
    pos: BlockPosition;
    vec: Vector;
    block: Tile;
    entity: number;
  };

  Callback.addCallback("ItemUseNoTarget", (item, player) => {
    Game.message(JSON.stringify(PlayerHelper.getPointed()))
  })
}

function getIdByNumber(id: int) {
 return String(IDRegistry.getIdInfo(id)).split(":")[1]//.split("#")[0];
};

function hasWordInID(id: int, word: string) {
   return getIdByNumber(id).includes(word);
}

namespace ConfigManager {
   export const IdeaAnimation = __config__.getBool("idea_animation") || true;
}

const NetworkEvent = BlockEngine.Decorators.NetworkEvent;
const ContainerEvent = BlockEngine.Decorators.ContainerEvent;
const ClientSide = BlockEngine.Decorators.ClientSide;

