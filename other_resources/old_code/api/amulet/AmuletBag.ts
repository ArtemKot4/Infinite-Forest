class AmuletBag {
  public static list: Record<int, AmuletUI> = {};
  public static readonly ITEM: FItem = new FItem("amulet_bag", 1);
  static {
    Item.registerNoTargetUseFunction(AmuletBag.ITEM.getID(), AmuletBag.onUse);
  }
  public static onUse(item: ItemInstance, player: number) {
    const amulet_list = AmuletUI.detectAmulets(player);
    for (let list of amulet_list) {
      if(list.detect !== undefined) {
        list.detect(player);
      }
    }
    alert("Сработало!");
    return AmuletUI.openFor(player);
  }
}
