class DungeonBlock extends FBlock {
  protected static list: int[] = [];
  protected static blacklist: playerName[] = [] 
  constructor(id: string, variation: Block.BlockVariation[], specialType: string | Block.SpecialType) {
    super(id, variation, specialType);
   DungeonBlock.addToDungeonList(this.getID())
  };
  public static addToDungeonList(block: int) {
    DungeonBlock.list.push(block);
  }
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
