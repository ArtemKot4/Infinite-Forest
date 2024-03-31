class Wood {
  public type: tree;

  //   public getAxe(id: string) {
  //  const spl = id.split("_");
  //   if(spl[spl.length - 1] === "axe") return true
  //     return false
  //   };
  constructor(type: tree) {
    this.type = type;
  }

  public registerBark() {
    const type = this.type;
    const name = type + "_bark";
    const texture = type + "_log";

    new FBlock.createWithRotation(name, [
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
    ]);

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
    ]);

    Block.setDestroyTime(BlockID[name], 0.4);
    ToolAPI.registerBlockMaterial(BlockID[name], "wood");

    Block.registerClickFunctionForID(
      BlockID[type + "_log"],
      (coords, item, block, player) => {
        if (item.id === VanillaItemID.stone_axe) {
          const blockSource = BlockSource.getDefaultForActor(player);
          blockSource.setBlock(coords.x, coords.y, coords.z, BlockID[name], 0);
          Entity.setCarriedItem(player, item.id, item.count, item.data + 1);
        }
      }
    );
  };
  
  private registerPlanksStairs() {
    const type = this.type;
    const name = type + "_planks";

    BlockRegistry.createStairs(name + "_stairs", [
      { name: name + "_stairs", texture: [[name, 0]], inCreative: true },
    ]);

    Block.setDestroyTime(BlockID[name + "_stairs"], 0.4);
    ToolAPI.registerBlockMaterial(BlockID[name + "_stairs"], "wood");
  }

  private registerPlanksSlabs() {
    const type = this.type;
    const name = type + "_planks";

    BlockRegistry.createSlabs(name + "_slabs", name, [
      { name: name + "_slabs", texture: [[name, 0]], inCreative: true },
    ]);

    Block.setDestroyTime(BlockID[name + "_slabs"], 0.4);
    ToolAPI.registerBlockMaterial(BlockID[name + "_slabs"], "wood");
  }
  public registerPlanks() {
    const type = this.type;
    const name = type + "_planks";
    new FBlock(type + "_planks", [
      { name: name, texture: [[name, 0]], inCreative: true },
    ]);

    Block.setDestroyTime(BlockID[name], 0.4);
    ToolAPI.registerBlockMaterial(BlockID[name], "wood");

    //this.registerPlanksSlabs();
    //this.registerPlanksStairs();
  }

  public registerLog() {
    const type = this.type;
    const name = type + "_log";
    FBlock.createWithRotation(name, [
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
          [name, 1],
          [name, 1],
          [name, 0],
          [name, 0],
        ],
        inCreative: false,
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
    ]);

    Block.setDestroyTime(BlockID[name], 0.4);
    ToolAPI.registerBlockMaterial(BlockID[name], "wood");
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


ModAPI.addAPICallback("WoodModel", (api: any) => {
  const WoodModel = api.WoodModel;
  const ModelType = api.ModelType;

  const setupModel = (id: string) => {
    WoodModel.registerBlock(BlockID[id], 0, ModelType.wood_0);
    WoodModel.registerBlock(BlockID[id], 1, ModelType.wood_1);
    WoodModel.registerBlock(BlockID[id], 2, ModelType.wood_2);

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

});
 