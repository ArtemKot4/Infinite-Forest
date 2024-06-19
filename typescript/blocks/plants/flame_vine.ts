interface IVineDescriptor {
  base: { texture: string; block_type?: string };
  top: { texture: string; block_type?: string };
}

class Vine {
  public readonly whitelist_blocks: int[];
  constructor(
    public readonly id: string,
    descriptor: IVineDescriptor,
    whitelist: int[] = [VanillaBlockID.grass]
  ) {
    this.whitelist_blocks = whitelist.concat([BlockID[id]]);
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
    Block.registerPlaceFunctionForID(BlockID[id], this.placeVine);
    Block.registerPlaceFunctionForID(BlockID[top_id], this.placeVineTop);
    Block.registerNeighbourChangeFunctionForID(BlockID[id], this.updateVine);
    Block.registerNeighbourChangeFunction(BlockID[top_id], this.updateVineTop);
    Block.setRandomTickCallback(BlockID[id], this.growing);
    Projectiles.breakBlock(BlockID[id]);
    Projectiles.detect(BlockID[top_id], this.projectileBreakFull);
  }
  protected placeVine(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: int, region: BlockSource) {
    if (
      this.whitelist_blocks.indexOf(
        region.getBlockId(coords.x, coords.y, coords.z)
      ) > -1 &&
      region.getBlockId(coords.x, coords.y + 1, coords.z) === 0
    ) {
      region.setBlock(coords.x, coords.y + 1, coords.z, BlockID[this.id], 0);
    }
  }
  protected placeVineTop(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: int, region: BlockSource) {
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

  protected updateVine(coords: Callback.ItemUseCoordinates, block: Tile, changedCoords: Vector, region: BlockSource) {
    if (
      this.whitelist_blocks.indexOf(
        region.getBlockId(coords.x, coords.y - 1, coords.z)
      ) > -1
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
  protected updateVineTop(coords: Callback.ItemUseCoordinates, block: Tile, changedCoords: Vector, region: BlockSource) {
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

  protected growing(x: int, y: int, z: int, id: number, data: int, region: BlockSource) {
    if (region.getBlockId(x, y + 1, z) === 0 && y < 200) {
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
}

const FLAME_VINE = new Vine(
  "flame_vine",
  {
    base: { texture: "flame_vine", block_type: BLOCK_TYPE_PLANT },
    top: { texture: "flame_vine_top", block_type: BLOCK_TYPE_FIRE },
  },
  [VanillaBlockID.magma, VanillaBlockID.grass]
);

Block.setAnimateTickCallback(BlockID["flame_vine_top"], (x, y, z, id, data) => {
  return fireParticle(x, y, z);
});

Block.setAnimateTickCallback(BlockID["flame_vine"], (x, y, z, id, data) => {
  if (Math.random() < 0.1) {
    return fireParticle(x, y, z);
  }
});
