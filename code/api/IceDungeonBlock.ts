class IceDungeonBlock extends IceBlock {
    protected static colorList = [
        "cyan",
        "blue",
        "green"
      ];
    constructor(id: string, textureKeyword: string) {
        const variation = [] as Block.BlockVariation[];
        for (const i in IceDungeonBlock.colorList) {
          const color = IceDungeonBlock.colorList[i];
          variation.push({
            name: `block.infinite_forest.${id}_${color}`,
            inCreative: true,
            texture: [[`${textureKeyword}_${color}`, 0]],
          });
        }
        super(id, variation);
       DungeonBlock.addToDungeonList(this.getID())
      };
};


namespace DungeonBlockList {
    export const DEFAULT_ICE = new IceDungeonBlock("blue_ice_bricks", "blue_ice_bricks");
}