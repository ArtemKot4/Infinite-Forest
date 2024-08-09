interface IVineDescriptor {
  base: { texture: string; block_type?: string };
  top: { texture: string; block_type?: string };
}

class Vine {
  public readonly whitelist_blocks: int[] = [];
  public readonly grow_height_limit: number = 200;
  constructor(
    public readonly id: string,
    descriptor: IVineDescriptor,
    whitelist: int[] = [VanillaBlockID.grass],
    grow_height_limit: number = 200
  ) {
    this.whitelist_blocks = whitelist.concat([BlockID[id]]);
    this.grow_height_limit = grow_height_limit;
    const top_id = id + "_top";
    Plants.registry(
      id,
      descriptor.base.texture,
      descriptor.base.block_type || null
    );
    Plants.registry(
      top_id,
      descriptor.top.texture,
      descriptor.top.block_type || null
    );
    Block.registerPlaceFunctionForID(BlockID[id], this.placeVine.bind(this));
    Block.registerPlaceFunctionForID(
      BlockID[top_id],
      this.placeVineTop.bind(this)
    );
    Block.registerNeighbourChangeFunctionForID(
      BlockID[id],
      this.updateVine.bind(this)
    );
    Block.registerNeighbourChangeFunction(
      BlockID[top_id],
      this.updateVineTop.bind(this)
    );
    Block.setRandomTickCallback(BlockID[id], this.growing.bind(this));
    Projectiles.breakBlock(BlockID[id]);
    Projectiles.detect(BlockID[top_id], this.projectileBreakFull.bind(this));
  }
  protected placeVine(
    coords: Callback.ItemUseCoordinates,
    item: ItemInstance,
    block: Tile,
    player: int,
    region: BlockSource
  ) {
    if (
      this.whitelist_blocks.includes(
        region.getBlockId(coords.x, coords.y, coords.z)
      ) &&
      region.getBlockId(coords.x, coords.y + 1, coords.z) === 0
    ) {
      region.setBlock(coords.x, coords.y + 1, coords.z, BlockID[this.id], 0);
    }
  }
  protected placeVineTop(
    coords: Callback.ItemUseCoordinates,
    item: ItemInstance,
    block: Tile,
    player: int,
    region: BlockSource
  ) {
    if (
      region.getBlockId(coords.x, coords.y, coords.z) === BlockID[this.id] &&
      region.getBlockId(coords.x, coords.y + 1, coords.z) === 0
    ) {
      region.setBlock(
        coords.x,
        coords.y + 1,
        coords.z,
        BlockID[this.id + "_top"],
        0
      );
    }
  }

  protected updateVine(
    coords: Callback.ItemUseCoordinates,
    block: Tile,
    changedCoords: Vector,
    region: BlockSource
  ) {
    if (
      this.whitelist_blocks.includes(
        region.getBlockId(coords.x, coords.y - 1, coords.z)
      ) === false
    ) {
      region.destroyBlock(coords.x, coords.y, coords.z, true);
    }
  }
  protected detectStems(region: BlockSource, coords: Vector) {
    let end = 1;
    while (
      region.getBlockId(coords.x, coords.y - end, coords.z) === BlockID[this.id]
    ) {
      end++;
    }
    return end;
  }
  protected updateVineTop(
    coords: Callback.ItemUseCoordinates,
    block: Tile,
    changedCoords: Vector,
    region: BlockSource
  ) {
    if (
      region.getBlockId(coords.x, coords.y - 1, coords.z) !== BlockID[this.id]
    ) {
      region.destroyBlock(coords.x, coords.y, coords.z, true);
      return;
    }
    if (region.getBlockId(coords.x, coords.y + 1, coords.z) !== 0) {
      for (let i = 0; i < this.detectStems(region, coords); i++) {
        region.destroyBlock(coords.x, coords.y - i, coords.z, true);
      }
    }
  }

  protected growing(
    x: int,
    y: int,
    z: int,
    id: number,
    data: int,
    region: BlockSource
  ) {
    if (region.getBlockId(x, y + 1, z) === 0 && y < this.grow_height_limit) {
      if (y >= 199) {
        region.setBlock(x, y + 1, z, BlockID[this.id + "_top"], 0);
        return;
      }
      if (Math.random() < 0.05) {
        region.setBlock(x, y + 1, z, BlockID[this.id + "_top"], 0);
      } else {
        region.setBlock(x, y + 1, z, BlockID[this.id], 0);
      }
    }
  }
  protected projectileBreakFull(
    x: number,
    y: number,
    z: number,
    block: number,
    region: BlockSource
  ) {
    for (let i = 0; i <= this.detectStems(region, { x: x, y: y, z: z }); i++) {
      region.destroyBlock(x, y - i, z, true);
    }
  }
  public static generateOn(
    height: int,
    coords: Vector,
    vine: Vine,
    region: BlockSource | typeof World = World
  ) {
    let i = 1;
    for (i; i < height; i++) {
      region.setBlock(coords.x, coords.y + i, coords.z, BlockID[vine.id], 0);
    }
    region.setBlock(
      coords.x,
      coords.y + i,
      coords.z,
      BlockID[vine.id + "_top"],
      0
    );
  }
}

const FLAME_VINE = new Vine(
  "flame_vine",
  {
    base: { texture: "flame_vine", block_type: BLOCK_TYPE_PLANT },
    top: { texture: "flame_vine_top", block_type: BLOCK_TYPE_FIRE },
  },
  [VanillaBlockID.red_sandstone, VanillaBlockID.grass]
);

Block.setAnimateTickCallback(BlockID["flame_vine_top"], (x, y, z, id, data) => {
  return fireParticle({x, y, z});
});

Block.setAnimateTickCallback(BlockID["flame_vine"], (x, y, z, id, data) => {
  if (Math.random() < 0.1) {
    return fireParticle({x, y, z});
  }
});

/*
const PRICKLY_VINE = new Vine(
  "prickly_vine",
  {
    base: { texture: "prickly_vine", block_type: BLOCK_TYPE_PLANT },
    top: { texture: "prickly_vine_top", block_type: BLOCK_TYPE_PLANT },
  },
  [VanillaBlockID.magma, VanillaBlockID.grass]
);

function pricklyDamage(blockCoords: Vector, block: Tile, entity: number) {
  if(Math.random() < 0.5) return;
  if (Entity.getType(entity) === Native.EntityType.ITEM) {
    Entity.remove(entity);
    return;
  }
  const player = new PlayerActor(entity);
  if (player.isValid() && player.getGameMode() === EGameMode.CREATIVE) {
    return;
  }
  const pos = Entity.getPosition(entity);
  if (Math.random() < 0.3) {
    for (let i = 0; i <= 8; i++) {
      ForestParticle.send(
        EForestParticle.POISON,
        entity + parseInt("0." + randomInt(2, 6)),
        entity + 0.5,
        entity - parseInt("0." + randomInt(2, 6)),
        0,
        -0.05,
        0,
        entity
      );
    }
  }
  return Entity.addEffect(entity, EPotionEffect.POISON, 1, 60, false, false);
}

Block.registerEntityInsideFunctionForID(BlockID["prickly_vine"], pricklyDamage);
Block.registerEntityInsideFunctionForID(
  BlockID["prickly_vine_top"],
  pricklyDamage
);
Block.registerEntityStepOnFunctionForID(BlockID["prickly_vine"], pricklyDamage);
Block.registerEntityStepOnFunctionForID(
  BlockID["prickly_vine_top"],
  pricklyDamage
);
*/