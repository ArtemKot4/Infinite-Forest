class DungeonBlock extends IceBlock {
  protected static list: int[] = [];
  protected static blacklist: playerName[] = [] 
  protected static colorList = [
    "cyan",
    "blue",
    "green"
  ];
  constructor(id: string, textureKeyword: string) {
    const variation = [] as Block.BlockVariation[];
    for (const i in DungeonBlock.colorList) {
      const color = DungeonBlock.colorList[i];
      variation.push({
        name: `block.infinite_forest.${id}_${color}`,
        inCreative: true,
        texture: [[`${textureKeyword}_${color}`, 0]],
      });
    }
    super(id, variation);
    DungeonBlock.list.push(this.getID());
  };
  protected static hasBlock(player: int) {
    const name = Entity.getNameTag(player);
    const actor = new PlayerActor(player);
    if(actor.getGameMode() === EGameMode.CREATIVE) return true;
    return this.blacklist.includes(name) 
  }
  protected static destroyBlock(
    coords: Callback.ItemUseCoordinates,
    block: Tile,
    player: number
  ) {
    if(!DungeonBlock.list.includes(block.id)) return;
    if (ColdCurse.has(player) || !DungeonBlock.hasBlock(player)) {
      Game.prevent();
    };
  }
  static {
    Callback.addCallback("DestroyBlockStart", DungeonBlock.destroyBlock);
    Callback.addCallback("DestroyBlock", DungeonBlock.destroyBlock);
  }
}

namespace DungeonBlockList {
    export const DEFAULT_ICE = new DungeonBlock("blue_ice_bricks", "blue_ice_bricks");
}