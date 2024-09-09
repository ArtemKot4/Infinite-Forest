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
    ];

    constructor(
      public id: string,
      public texture?: string,
      lightLevel?: int,
      type?: string | Block.SpecialType
    ) {
      super(id, [{
        name: "block.infinite_forest." + id,
        texture: [[texture || id, 0]],
        inCreative: true,
      }], type);

      this.create();
      lightLevel && BlockRegistry.setLightLevel(BlockID[id], lightLevel);
     // Block.registerPlaceFunctionForID(BlockID[id], this.placeFunction.bind(this))
     this.setModelByConditions();
    };
    public placeFunction(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number, region: BlockSource) {
     Game.message("coords.side -> " + coords.side);
      if(coords.side === 0) { //UP
            region.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, this.getID(), 1);
            return;
      };
      region.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, this.getID(), 0);
    };
    public setModelByConditions() {
      const group = ICRender.getGroup(this.id + "-group");
      const model = new ICRender.Model();
      const conditionList = [];

      for(let i = 0; i < UndergroundCrystal.boxList.length; i++) {

        const current = UndergroundCrystal.boxList[i];
         const blockModel = new BlockRenderer.Model(current[0], 0, current[1],
           current[2], 1, current[3], this.getID(), 0);
           conditionList.push(  ICRender.BLOCK(0, 1+i, 0, group, false));
         model.addEntry(blockModel)
         .setCondition(ICRender.AND(conditionList.concat(ICRender.NOT(
          ICRender.BLOCK(0, 2+i, 0, group, false)
        )
        )
        )
          )
      };

      BlockRenderer.setStaticICRender(this.getID(), -1, model);
    }
  }


  export namespace UndergroundRock {
    export const BLUE_CRYSTAL = new UndergroundCrystal(
      "blue_underground_crystal",
      null,
      randomInt(3, 8),
      BLOCK_TYPE_GLASS
    );

    export const GREEN_CRYSTAL = new UndergroundCrystal(
      "green_underground_crystal",
      null,
      randomInt(3, 8),
      BLOCK_TYPE_GLASS
    );

    export const ORANGE_CRYSTAL = new UndergroundCrystal(
      "orange_underground_crystal",
      null,
      randomInt(3, 8),
      BLOCK_TYPE_GLASS
    );

    export const RED_CRYSTAL = new UndergroundCrystal(
      "red_underground_crystal",
      null,
      randomInt(3, 8),
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

// Callback.addCallback("ItemUse", (coords, item, block, i, player) => {
//   if(item.id === VanillaItemID.bone) {
//     if(Entity.getSneaking(player)) {
//           ForestGeneration.UndergroundRock.STONE_STALACTITE.placeBottom(coords, 0, 4)
//     } else {
//           ForestGeneration.UndergroundRock.STONE_STALACTITE.placeTop(coords, 4, 8)
//     }
//   }
// })