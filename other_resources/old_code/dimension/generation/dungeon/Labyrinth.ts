namespace Labyrinth {
  const HEIGHT = 3;
  const WIDTH = 4;
  const LENGTH = 12;

  function randomInt(min, max) {
    if (!max) {
      max = min;
      min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomDirection() {
    let value = Math.round(Math.random() * (4 - 1));
    return value;
  }

  function digLineWithRot(region: BlockSource, pos) {
    let origin = { x: 0, y: 0, z: 0 };
    let dir = randomDirection();
    let wx, wz, lx, lz, hy;
    if ((dir = 0)) (wx = 0), (wz = 1), (lx = 1), (lz = 0), (hy = 1);
    if ((dir = 1)) (wx = 0), (wz = 1), (lx = -1), (lz = 0), (hy = 1);
    if ((dir = 2)) (wx = 1), (wz = 0), (lx = 0), (lz = 1), (hy = 1);
    if ((dir = 3)) (wx = 1), (wz = 0), (lx = 0), (lz = -1), (hy = 1);

    for (let w = -WIDTH / 2; w < WIDTH / 2; w++) {
      for (let h = -HEIGHT / 2; h < HEIGHT / 2; w++) {
        for (let l = 0; l < LENGTH; l++) {
          let dx = origin.x + w * wx + l * lx;
          let dh = origin.y + h * hy;
          let dz = origin.z + w * wz + l * lz;
          region.setBlock(pos.x + dx, pos.y + dh, pos.z + dz, 0, 0);
          region.setBlock(pos.x + dx + 1, pos.y + dh + 1, pos.z + dz + 1, Sign.block.getID(), 0);
        }
      }
    }
    return (pos.x = origin.x + LENGTH * lx);
    return (pos.z = origin.z + LENGTH * lz);
  }

  function generateLoot(region, pos) {}

  function randomLines(region, pos, iterator) {
    for (let k = iterator.it; k < iterator.maxIt; k++) {
      Game.message("hi");
      digLineWithRot(region, pos);
      if (iterator.it++ < iterator.maxIt) {
        randomLines(region, pos, iterator);
      }
    }
  }

  function buildLabyrinth(region, pos, minLines, maxLines) {
    randomLines(region, pos, { it: 0, maxIt: randomInt(minLines, maxLines) });
  };

  Callback.addCallback("ItemUse", (coords, item,block, isE, player) => 
  item.id === VanillaItemID.bone && 
  buildLabyrinth(BlockSource.getDefaultForActor(player), 
  new Vector3(coords.x, coords.y + 1, coords.z), 2, 5))

}
