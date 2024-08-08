namespace Plants {
    export const block_list = [
      VanillaBlockID.dirt,
      VanillaBlockID.podzol,
      VanillaBlockID.grass,
      VanillaBlockID.grass_path,
      VanillaBlockID.mycelium,
    ];
    export function registry(
      id: string,
      texture: string,
      type = BLOCK_TYPE_PLANT,
      inCreative = true
    ) {
      new FBlock(
        id,
        [
          {
            name: "block.infinite_forest." + id,
            texture: [[texture, 0]],
            inCreative: true,
          },
        ],
        type
      ).create();
      const render = new ICRender.Model();
      const model = BlockRenderer.createModel();
      const shape = new ICRender.CollisionShape();
      const entry = shape.addEntry();
      entry.addBox(0, 0, 0, 0, 0, 0);
      BlockRenderer.setCustomCollisionShape(BlockID[id], -1, shape);
      render.addEntry(model);
    }


  export function setPlaceFunction(id: EForestPlants, blockList: int | int[] = [VanillaBlockID.grass]) {
      let resultArray = Array.isArray(blockList) ? blockList : [blockList];
      Block.registerPlaceFunctionForID(id, (coords, item, block, player, region) => {
        if(!resultArray.includes(block.id)) {
          return;
        };
        const relative = coords.relative
        TileEntity.destroyTileEntityAtCoords(relative.x, relative.y, relative.z)
        region.setBlock(relative.x, relative.y, relative.z, id, 0);
        TileEntity.addTileEntity(relative.x, relative.y, relative.z);
      })
  }
};

  function fireParticle(x, y, z) {
    Particles.addParticle(
      Native.ParticleType.flame,
      x + 0.5,
      y + 0.7,
      z + 0.5,
      Math.random() / 20,
      Math.random() / 20,
      Math.random() / 20
    );
  }  

enum EForestPlants {
    ELECTRIC_MUSHROOM = BlockID["electric_mushroom"],
    FIRONIA = BlockID["fironia"],
    ICE_FLOWER = BlockID["ice_flower"],
  };