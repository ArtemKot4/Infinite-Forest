class Infinite {
  protected dimension = InfiniteForest.id;
  protected isForest(): boolean {
    if (Player.getDimension() == this.dimension) {
      return true;
    }
  }
}

class Wood extends Infinite {
  private name: string;
  private id: string;
  private texture: string;
  constructor( id: string,name: string, texture: string) {
    super();
    this.name = name;
    this.id = id;
    this.texture = texture;

    IDRegistry.genBlockID(id + "_log");
    Block.createBlockWithRotation(
      id + "_log",
      [
        {
          name: name,
          texture: [
            [texture + "_log", 0],
            [texture + "_log", 0],
            [texture + "_log", 1],
            [texture + "_log", 1],
            [texture + "_log", 1],
            [texture + "_log", 1],
          ],
          inCreative: true,
        },
      ],
      "opaque"
    );
   
    IDRegistry.genBlockID(id + "_planks");
    Block.createBlockWithRotation(
      id + "_planks",
      [
        {
          name: name,
          texture: [[texture + "_planks", 0]],
          inCreative: true,
        },
      ],
      "opaque"
    );

    Recipes.addShaped(
      { id: VanillaBlockID.chest, count: 1, data: 0 },
      ["bbb", "b b", "bbb"],
      ["b", BlockID[id + "_planks"], 0]
    );

    Recipes.addShaped(
      { id: BlockID[id + "_planks"], count: 4, data: 0 },
      ["a"],
      ["a", BlockID[id + "_log"]]
    );

    IDRegistry.genBlockID(id + "_slab");
    Block.createBlockWithRotation(
      id + "_slab",
      [
        {
          name: name,
          texture: [[texture + "_planks", 0]],
          inCreative: true,
        },
      ],
      "opaque"
    );

    TileRenderer.makeSlab(BlockID[id + "_slab"], BlockID[id + "_planks"]);

    Recipes.addShaped(
      { id: BlockID[id + "_slab"], count: 3, data: 0 },
      ["aaa"],
      ["a", BlockID[id + "_planks"]]
    );

    IDRegistry.genBlockID(id+"_stairs");
    BlockRegistry.createStairs(
      id+"_stairs",
      [
        {
          name: name,
          texture: [[texture+"_planks", 0]],
          inCreative: true,
        },
      ],
      "opaque"
    );

    Recipes.addShaped(
        { id: BlockID[id + "_stairs"], count: 4, data: 0 },
        ["a",
         "aa",
         "aaa"],
        ["a", BlockID[id + "_planks"]]
      );

      Block.setDestroyTime(BlockID[id + "_log"], 0.4);
      Block.setDestroyTime(BlockID[id + "_planks"], 0.4);
      Block.setDestroyTime(BlockID[id + "_slab"], 0.4);
      Block.setDestroyTime(BlockID[id + "_stairs"], 0.4);
      ToolAPI.registerBlockMaterial(BlockID[id + "_log"], "wood");
      ToolAPI.registerBlockMaterial(BlockID[id + "_planks"], "wood");
      ToolAPI.registerBlockMaterial(BlockID[id + "_slab"], "wood");
      ToolAPI.registerBlockMaterial(BlockID[id + "_stairs"], "wood");  


  }
}

new Wood("eucalyptus","Eucalypt","eucalyptus")