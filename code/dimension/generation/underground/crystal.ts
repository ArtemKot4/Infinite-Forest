namespace ForestGeneration {
  export class UndergroundCrystal extends FBlock {
    public static boxList = [
      [-0.1875, -0.1875, 1.1875, 1.1875],
      [-0.125, -0.125, 1.125, 1.125],
      [-0.0625, -0.0625, 1.0625, 1.0625],
      [0, 0, 1, 1, 1],
      [0.0625, 0.0625, 0.9375, 0.9375],
      [0.125, 0.125, 0.875, 0.875],
      [0.1875, 0.1875, 0.8125, 0.8125],
      [0.25, 0.25, 0.75, 0.75],
      [0.3125, 0.3125, 0.6875, 0.6875],
      [0.375, 0.375, 0.625, 0.625],
      [0.4375, 0.4375, 0.5625, 0.5625],
      [0.453125, 0.453125, 0.546875],
    ];
    constructor(
      public id: string,
      public texture?: string,
      lightLevel?: int,
      type?: string | Block.SpecialType
    ) {
      const datas = (new Array(12) as Block.BlockVariation[]).fill({
        name: "block.infinite_forest." + id,
        texture: [[texture || id, 0]],
        inCreative: true,
      });

      super(id, datas, type);

      this.create();

      UndergroundCrystal.boxList.forEach((v, i) => {
        Block.setShape(BlockID[id], v[0], 0, v[1], v[2], 1, v[3], i);
      });

      lightLevel && BlockRegistry.setLightLevel(BlockID[id], lightLevel);
    };
    protected findStartData() {
      const random = Math.random();
      let startData = 0;

      if (random < 0.8) {
        startData = randomInt(0, 2);
      } else {
        startData = randomInt(0, 6);
      };
      return startData;

    };

    public placeBottom(coords: Vector) {
     
      const startData = this.findStartData();
      const blockCount = 12 - (startData + 1);

      for(let count = 0; count <= blockCount; count++) {
        World.setBlock(coords.x, coords.y + count, coords.z, BlockID[this.id], count);
      };
    };

    public placeTop(coords: Vector) {
      
      const startData = this.findStartData();
      const blockCount = 12 - (startData + 1);

      for(let count = blockCount; count >= 0; count--) {
        World.setBlock(coords.x, coords.y - count, coords.z, BlockID[this.id], count);
      };
    }
  }

  export namespace UndergroundRock {
    export const BLUE_CRYSTAL = new UndergroundCrystal(
      "blue_underground_crystal",
      null,
      randomInt(3, 12),
      BLOCK_TYPE_GLASS
    );

    export const GREEN_CRYSTAL = new UndergroundCrystal(
      "green_underground_crystal",
      null,
      randomInt(3, 12),
      BLOCK_TYPE_GLASS
    );

    export const ORANGE_CRYSTAL = new UndergroundCrystal(
      "orange_underground_crystal",
      null,
      randomInt(3, 12),
      BLOCK_TYPE_GLASS
    );

    export const RED_CRYSTAL = new UndergroundCrystal(
      "red_underground_crystal",
      null,
      randomInt(3, 12),
      BLOCK_TYPE_GLASS
    );

    export const STONE_STALACTITE = new UndergroundCrystal(
      "stone_stalactite",
      "stone"
    );

    export const DIORITE_STALACTITE = new UndergroundCrystal(
      "diorite_stalactite",
      "stone_diorite"
    );

    export const ANDESITE_STALACTITE = new UndergroundCrystal(
      "andesite_stalactite",
      "stone_andesite"
    );

    export const GRANITE_STALACTITE = new UndergroundCrystal(
      "granite_stalactite",
      "granite_andesite"
    );

    export const COBBLESTONE_STALACTITE = new UndergroundCrystal(
      "cobblestone_stalactite",
      "granite_andesite"
    );
    
    export const SALT_STALACTITE = new UndergroundCrystal(
      "salt_stalactite",
      "salt"
    );
    
  }
}

Callback.addCallback("ItemUse", (coords, item, block, i, player) => {
  if(item.id === VanillaItemID.bone) {
    if(Entity.getSneaking(player)) {
          ForestGeneration.UndergroundRock.STONE_STALACTITE.placeBottom(coords)
    } else {
          ForestGeneration.UndergroundRock.STONE_STALACTITE.placeTop(coords)
    }
  }
})