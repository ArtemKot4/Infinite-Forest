namespace ForestGeneration {
 // ForestBiomes.HeartForest.addStructure("winter_tree", 0, 11);
  export class GreatWall extends DungeonBlock {
    protected static destroyBlock(
      coords: Callback.ItemUseCoordinates,
      block: Tile,
      player: number
    ) {
      if (!GreatWall.list.includes(block.id)) return;
      if (!Curse.hasList(player, Curse.getCurseList())) {
        Game.prevent();
      }
    }
    static {
      Callback.addCallback("DestroyBlockStart", GreatWall.destroyBlock);
      Callback.addCallback("DestroyBlock", GreatWall.destroyBlock);
    }
    constructor(
      id: string,
      variation: Block.BlockVariation[],
      specialType: string | Block.SpecialType
    ) {
      super(id, variation, specialType);
      BlockRegistry.setDestroyTime(this.getID(), 5000);
      BlockRegistry.setDestroyLevel(this.getID(), MiningLevel.STONE);
    }
  }

  new GreatWall(
    "great_wall",
    [
      {
        name: "block.infinite_forest.great_wall",
        texture: [["great_wall", 0]],
        inCreative: true,
      },
    ],
    "stone"
  ).create();
  function checkOffset(x, z, offset: int) {
    return x >= offset && x <= offset && z <= offset
  }
  export function generateGreatWall(x: int, z: int) {
    const OFFSET = ForestBiomes.HEART_FOREST_COORDS - 16;
    if (
      checkOffset(x, z, ForestBiomes.HEART_FOREST_COORDS - 16) ||
      checkOffset(x, z, ForestBiomes.HEART_FOREST_COORDS * 1.3333333 + 16) 
    )
      if (
        x >= OFFSET &&
        x <= ForestBiomes.HEART_FOREST_COORDS &&
        z >= OFFSET &&
        z <= ForestBiomes.HEART_FOREST_COORDS
      ) {
        for (let y = 1; y <= 120; y++) {
          World.setBlock(x, y, z, DungeonBlocks.GREAT_WALL, 0);
        }
      }
  }
}

enum DungeonBlocks {
  GREAT_WALL = BlockID["great_wall"],
}
