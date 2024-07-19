type tree = "cherry" | "eucalyptus" | "pink" | "winter";

class Wood {
  public type: tree;
  constructor(type: tree) {
    this.type = type;
  }

  public registerBark() {
    const type = this.type;
    const name = type + "_bark";
    const texture = type + "_log";

    new FBlock(name, [
      {
        name,
        texture: [
          [texture, 1],
          [texture, 1],
          [texture, 1],
          [texture, 1],
          [texture, 1],
          [texture, 1],
        ],
        inCreative: true,
      },
    ]).createWithRotation();

    Block.setDestroyTime(BlockID[name], 0.4);
    ToolAPI.registerBlockMaterial(BlockID[name], "wood");
  }

  public registerHewn() {
    const type = this.type;
    const name = type + "_hewn";
    new FBlock(name, [
      {
        name,
        texture: [
          [name, 0],
          [name, 0],
          [name, 1],
          [name, 1],
          [name, 1],
          [name, 1],
        ],
        inCreative: true,
      },
    ]).create();

    Block.setDestroyTime(BlockID[name], 0.4);
    ToolAPI.registerBlockMaterial(BlockID[name], "wood");

  }
  public registerPlanks() {
    const type = this.type;
    const name = type + "_planks";
    new FBlock(type + "_planks", [
      { name: name, texture: [[name, 0]], inCreative: true },
    ]).create();

    Block.setDestroyTime(BlockID[name], 0.4);
    ToolAPI.registerBlockMaterial(BlockID[name], "wood");
  }
  public logPlaceFunction(
    coords: Callback.ItemUseCoordinates,
    item: ItemInstance,
    block: Tile,
    player: number,
    region: BlockSource
  ) {
    let data = 0;
    switch (coords.side) {
      case EBlockSide.EAST:
        data = 2;
        break;
      case EBlockSide.WEST:
        data = 2;
        break;
      case EBlockSide.NORTH:
        data = 1;
        break;
      case EBlockSide.SOUTH:
        data = 1;
        break;
    };
    region.setBlock(
      coords.relative.x,
      coords.relative.y,
      coords.relative.z,
      this["id"],
      data
    );

  };
  public cutLogFunction(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number) {
    if (ToolAPI.getToolData(item.id)?.blockMaterials?.["wood"]) {
      const blockSource = BlockSource.getDefaultForActor(player);
      blockSource.setBlock(coords.x, coords.y, coords.z, this["id"], block.data);
      Entity.setCarriedItem(player, item.id, item.count, item.data + 1);
    }
  }
  public registerLog() {
    const type = this.type;
    const name = type + "_log";
    new FBlock(name, [
      {
        name,
        texture: [
          [name, 0],
          [name, 0],
          [name, 1],
          [name, 1],
          [name, 1],
          [name, 1],
        ],
        inCreative: true,
      },
      {
        name,
        texture: [
          [name, 1],
          [name, 1],
          [name, 0],
          [name, 0],
          [name, 1],
          [name, 1],
        ],
        inCreative: false,
      },
      {
        name,
        texture: [
          [name, 1],
          [name, 1],
          [name, 1],
          [name, 1],
          [name, 0],
          [name, 0],
        ],
        inCreative: false,
      },
    ]).create();

    Block.setDestroyTime(BlockID[name], 0.4);
    ToolAPI.registerBlockMaterial(BlockID[name], "wood");
    Block.registerPlaceFunctionForID(
      BlockID[name],
      this.logPlaceFunction.bind({ id: BlockID[name] })
    )
      Block.registerClickFunctionForID(
        BlockID[name],
        this.cutLogFunction.bind({id: BlockID[`${type}_hewn`]})
      );
  }
}

const CHERRY = new Wood("cherry");
// CHERRY.registerLog();

const EUCALYPTUS = new Wood("eucalyptus");
EUCALYPTUS.registerBark();
EUCALYPTUS.registerPlanks();
EUCALYPTUS.registerLog();
EUCALYPTUS.registerHewn();

const PINK = new Wood("pink");
PINK.registerBark();
PINK.registerPlanks();
PINK.registerLog();
PINK.registerHewn();

const WINTER = new Wood("winter");
WINTER.registerLog();
WINTER.registerBark();
WINTER.registerPlanks();

ModAPI.addAPICallback("WoodModel", (api: any) => {
  const WoodModel = api.WoodModel;
  const ModelType = api.ModelType;

  const setupModel = (id: string) => {
    WoodModel.registerBlock(BlockID[id], 0, ModelType.WOOD_0);
    WoodModel.registerBlock(BlockID[id], 1, ModelType.WOOD_1);
    WoodModel.registerBlock(BlockID[id], 2, ModelType.WOOD_2);

    WoodModel.setLightOpacity(BlockID[id], 0);
    WoodModel.setRenderLayer(BlockID[id], 1);
  };

  const setupModelByKeyword = (keyword: tree) => {
    setupModel(keyword + "_log");
    setupModel(keyword + "_hewn");
    setupModel(keyword + "_bark");
  };

  setupModelByKeyword("eucalyptus");
  setupModelByKeyword("pink");
  setupModelByKeyword("winter");
});
