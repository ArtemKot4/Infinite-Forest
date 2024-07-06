type player = int;
type dimension = int;

abstract class TransferCrystal {
  private constructor() {}
  public static storage: TransferStorage = new TransferStorage(
    "infinite_transfer_storage"
  );
  public static worldList: Record<player, dimension>;
  public static worldBlacklist: EDimension[] = [
    EDimension.END,
    EDimension.NETHER,
  ];
  public static itemBlacklist: int[] = [
    VanillaBlockID.netherite_block,
    VanillaItemID.netherite_ingot,
    VanillaItemID.ancient_debris,
    VanillaItemID.netherite_axe,
    VanillaItemID.netherite_hoe,
    VanillaItemID.netherite_shovel,
    VanillaItemID.netherite_sword,
    VanillaItemID.netherite_pickaxe,
    VanillaItemID.netherite_scrap,
    VanillaItemID.netherite_boots,
    VanillaItemID.netherite_chestplate,
    VanillaItemID.netherite_helmet,
    VanillaItemID.netherite_leggings,
  ];
  public static readonly BLUE = new FItem("blue_crystal", 1);
  public static readonly ORANGE = new FItem("orange_crystal", 1);
  public static transferEvent(player: int, dimension: int) {
    const entity = new PlayerEntity(player);
    const currentWorld = entity.getDimension();
    if (
      currentWorld !== dimension &&
      !TransferCrystal.worldBlacklist.includes(currentWorld) &&
      Entity.getSneaking(player) === true
    ) {
      entity.getGameMode() !== EGameMode.CREATIVE &&
        entity.decreaseCarriedItem(1);
      Dimensions.transfer(player, dimension);
    }
  }
  public static validateBlacklist(player): Nullable<ItemInstance[]> {
    const client = Network.getClientForPlayer(player);
    const actor = new PlayerActor(player);
    const result: string[] = [];
    const list: ItemInstance[] = [];
    for (let i = 0; i <= 35; i++) {
      const item = actor.getInventorySlot(i);
      if (TransferCrystal.itemBlacklist.includes(item.id)) {
        result.push(Translation.translate(Item.getName(item.id, item.data)));
        list.push(item);
      }
    }
    if (result.length <= 0) return null;
    if (client) {
      BlockEngine.sendUnlocalizedMessage(
        client,
        Native.Color.GREEN,
        Translation.translate(
          "message.infinite_forest.crystal_transfer_blacklist"
        )
      );
      for (const message of result) {
        BlockEngine.sendUnlocalizedMessage(
          client,
          Native.Color.RED,
          " * ",
          message,
          "\n"
        );
      }
      return list;
    }
  };
  public static onUseBlue(coords, item, block, player) {
    const list = TransferCrystal.validateBlacklist(player);
    const name = Entity.getNameTag(player);
    if (!!list && list instanceof Array) {
      TransferCrystal.storage.place(
        new Vector3(coords.x, coords.y + 1, coords.z),
        player,
        list
      );
    }
    TransferCrystal.worldList[name] = Entity.getDimension(player);
    TransferCrystal.transferEvent(player, InfiniteForest.id);
    return;
  };
  public static onUseOrange(coords, item, block, player) {
    const name = Entity.getNameTag(player);
    const takeDimension = (TransferCrystal.worldList[name] ??=
      EDimension.NORMAL);
    TransferCrystal.transferEvent(player, takeDimension);
    return;
  }
  static {
    TransferCrystal.BLUE.onUse(TransferCrystal.onUseBlue);
    TransferCrystal.ORANGE.onUse(TransferCrystal.onUseOrange);
    // Saver.addSavesScope(
    //   "infinite_forest.defaultDimension.list",
    //   function read(scope) {
    //     TransferCrystal.worldList = scope.worldList || {};
    //   },

    //   function save() {
    //     return { worldList: TransferCrystal.worldList };
    //   }
    // );
  }
}
