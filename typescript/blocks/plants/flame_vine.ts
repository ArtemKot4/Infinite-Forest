interface IVineDescriptor {
 base: {texture: string, block_type?: string},
 top: {texture: string, block_type?: string}
};

class Vine {
    public readonly whitelist_blocks: int[] = [];
    constructor(public id: string, descriptor: IVineDescriptor, whitelist: int[]) {
        whitelist.push(BlockID[id]);
        this.whitelist_blocks = whitelist;
        Plants.registry(id, descriptor.base.texture,descriptor.base.block_type  || null);
        Plants.registry(id + "_top", descriptor.top.texture, descriptor.top.block_type || null);
        Block.registerPlaceFunctionForID(
            BlockID[id], this.placeVine);
            Block.registerPlaceFunctionForID(BlockID[id + "_top"], this.placeVineTop);
            Block.registerNeighbourChangeFunctionForID(BlockID[id], this.updateVine);
            Block.setRandomTickCallback(BlockID[id], this.growing);
            Projectiles.breakBlock(BlockID[id]);
            Projectiles.detect(BlockID[id + "_top"], this.projectileBreakFull);
    };
    placeVine(coords, item, block, player, region) {
        if (
            this.whitelist_blocks.includes(
              region.getBlockId(coords.x, coords.y, coords.z)
            ) &&
            region.getBlockId(coords.x, coords.y + 1, coords.z) === 0
          ) {
            region.setBlock(
              coords.x,
              coords.y + 1,
              coords.z,
              BlockID[this.id],
              0
            );
          }
    };
    placeVineTop(coords, item, block, player, region) {
        if (
            region.getBlockId(coords.x, coords.y, coords.z) === BlockID[this.id]
          ) {
            region.setBlock(
              coords.x,
              coords.y + 1,
              coords.z,
              BlockID[this.id + "_top"],
              0
            );
          }
    };

    updateVine(coords, block, changedCoords, region) {
        if (
            this.whitelist_blocks.includes(
              region.getBlockId(coords.x, coords.y - 1, coords.z)
            ) === false
          ) {
            region.destroyBlock(coords.x, coords.y, coords.z, true);
          }
    };
    protected detectStems(region: BlockSource, coords: Vector) {
        let end = 1;
        while (
          region.getBlockId(coords.x, coords.y - end, coords.z) ===
          BlockID[this.id]
        ) {
          end++;
        };
        return end;
    } 
    updateVineTop(coords, block, changedCoords, region) {
        if (
            region.getBlockId(coords.x, coords.y - 1, coords.z) !==
            BlockID[this.id]
          ) {
            region.destroyBlock(coords.x, coords.y, coords.z, true);
            return;
          }
          if (region.getBlockId(coords.x, coords.y + 1, coords.z) !== 0) {
           for(let i = 0; i < this.detectStems(region, coords); i++) {
            region.destroyBlock(coords.x, coords.y - i, coords.z, true);
           }
          }
    };

    growing(x, y, z, id, data, region) {
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
    };
    projectileBreakFull(x: number, y: number, z: number, block: number, region: BlockSource) {
      for(let i = 0; i <= this.detectStems(region, new Vector3(x, y, z)); i++) {
        region.destroyBlock(x, y - i, z, true);
      }
    };
}

const FLAME_VINE = new Vine("flame_vine", {
   base: {texture: "flame_vine", block_type: BLOCK_TYPE_PLANT},
   top: {texture: "flame_vine_top", block_type: BLOCK_TYPE_FIRE} 
}, [
    VanillaBlockID.magma,
    VanillaBlockID.grass,
  ]);
  
  Block.setAnimateTickCallback(BlockID["flame_vine_top"], (x, y, z, id, data) => {
    return fireParticle(x, y, z);
  });
  
  Block.setAnimateTickCallback(BlockID["flame_vine"], (x, y, z, id, data) => {
    if (Math.random() < 0.1) {
      return fireParticle(x, y, z);
    }
  });
