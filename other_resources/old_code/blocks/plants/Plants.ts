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

  export function setPlaceFunction(
    id: EForestPlants,
    blockList: int | int[] = [VanillaBlockID.grass]
  ) {
    let resultArray = Array.isArray(blockList) ? blockList : [blockList];
    Block.registerPlaceFunctionForID(
      id,
      (coords, item, block, player, region) => {
        if (!resultArray.includes(block.id)) {
          return;
        }
        const relative = coords.relative;
        TileEntity.destroyTileEntityAtCoords(
          relative.x,
          relative.y,
          relative.z
        );
        region.setBlock(relative.x, relative.y, relative.z, id, 0);
        TileEntity.addTileEntity(relative.x, relative.y, relative.z);
      }
    );
  }
}

function fireParticle(coords: Vector) {
  var xz = getMinDistance(30, 80);
  var x = xz.x;
  var y = random(0, 1);
  var z = xz.z;
  var xz = getMinDistance(3, 5);
  var xV = xz.x / 80;
  var yV = random(3, 5) / 600;
  var zV = xz.z / 80;

  Particles.addParticle(
    EParticleType.FLAME,
    coords.x + x,
    coords.y + y,
    coords.z + z,
    xV,
    yV,
    zV,
    0
  );
}

enum EForestPlants {
  ELECTRIC_MUSHROOM = BlockID["electric_mushroom"],
  FIRONIA = BlockID["fironia"],
  ICE_FLOWER = BlockID["ice_flower"],
}
