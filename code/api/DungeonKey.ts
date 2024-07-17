class DungeonKey extends FItem {
  constructor(
    id: string,
    stack?: number,
    name?: string,
    texture?: texture,
    meta?: number,
    isTech?: boolean
  ) {
    super(id, stack, name, texture, meta, isTech);
  }
  public isValid(item: ItemInstance, player: int) {
    const extra = item.extra;
    if (!extra || extra.getBoolean("lock") === null) {
      return item.id === this.getID();
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
