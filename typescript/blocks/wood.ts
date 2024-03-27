
class Wood {
    public type: tree;
    constructor(type: tree) {
      this.type = type;
    }
  
    public registerBark() {
      const type = this.type;
      const name = type + "_bark";
  
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
        },
      ]);
  
      Block.setDestroyTime(BlockID[name], 0.4);
      ToolAPI.registerBlockMaterial(BlockID[name], "wood");
    }
  private registerPlanksStairs() {
    const type = this.type;
    const name = type + "_planks";

    BlockRegistry.createStairs(name + "_stairs", [
        { name: name + "_stairs", texture: [[name, 0]], inCreative: true },
      ]);

      Block.setDestroyTime(BlockID[name+ "_stairs"], 0.4);
      ToolAPI.registerBlockMaterial(BlockID[name + "_stairs"], "wood");
  };

  private registerPlanksSlabs() {
    const type = this.type;
    const name = type + "_planks";
 //@ts-ignore
    BlockRegistry.createSlabs(name + "_slabs", BlockID[name + "_slabs"], [
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

    this.registerPlanksSlabs();
    this.registerPlanksStairs();

    }
  
    public registerLog() {
      const type = this.type;
      const name = type + "_log";
      new FBlock(name, [
        {
          name,
          texture: [
            [type, 0],
            [type, 0],
            [type, 1],
            [type, 1],
            [type, 1],
            [type, 1],
          ],
          inCreative: true,
        },
        {
          name,
          texture: [
            [type, 1],
            [type, 1],
            [type, 1],
            [type, 1],
            [type, 0],
            [type, 0],
          ],
          inCreative: false,
        },
        {
          name,
          texture: [
            [type, 1],
            [type, 1],
            [type, 0],
            [type, 0],
            [type, 1],
            [type, 1],
          ],
          inCreative: false,
        },
      ]);
  
      Block.setDestroyTime(BlockID[name], 0.4);
      ToolAPI.registerBlockMaterial(BlockID[name], "wood");
    }
  }
  
  const CHERRY = new Wood("cherry");
  CHERRY.registerLog();
  
  const EUCALYPTUS = new Wood("eucalyptus");
  EUCALYPTUS.registerBark();
  EUCALYPTUS.registerPlanks();
  EUCALYPTUS.registerLog();

  const PINK = new Wood("pink");
  PINK.registerBark();
  PINK.registerPlanks();
  PINK.registerLog();
  