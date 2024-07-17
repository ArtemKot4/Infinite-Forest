class DungeonKey extends FItem {
  constructor(
    id: string,
    stack: number = 1,
    name?: string,
    texture?: texture,
    meta?: number,
    isTech?: boolean
  ) {
    super(id, stack, name, texture, meta, isTech);
  }
  public isValid(item: ItemInstance, player: int) {
    if (ColdCurse.has(player)) {
      BlockEngine.sendUnlocalizedMessage(
        Network.getClientForPlayer(player),
        Native.Color.BLUE,
        Translation.translate("message.infinite_forest.cold_curse"),
        "..."
      );
      return false;
    }
    if (item.id === this.getID()) {
      const extra = item.extra;
      if (!extra || extra && extra.getBoolean("lock") === null) {
        return true;
      }
    }
    BlockEngine.sendUnlocalizedMessage(
      Network.getClientForPlayer(player),
      Native.Color.GREEN,
      Translation.translate("message.infinite_forest.wrong_key")
    );
    return false;
  }
  public setLock(item: ItemInstance, player: int) {
    const extra = item.extra;
    if (!extra || extra.getBoolean("lock") === null) {
      const newExtra = (item.extra = new ItemExtraData());
      newExtra.putBoolean("lock", true);
      Entity.setCarriedItem(player, item.id, item.count, item.data, newExtra);
    }
  }
}

Translation.addTranslation("message.infinite_forest.wrong_key", {
  en: "It's key don't fit to it door",
  ru: "Этот ключ не подходит к этой двери",
});

Translation.addTranslation("message.infinite_forest.cold_curse", {
  en: "You have a cold",
  ru: "Вам слишком холодно",
});

namespace DungeonKeyList {
  export const IceKey = new DungeonKey("ice_dungeon_key");
}
