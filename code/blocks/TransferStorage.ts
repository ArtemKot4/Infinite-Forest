class TransferStorage {
  public BLOCK: FBlock;
  public static transferBlocklist: int[] = [];
  public static storage: Record<string, ItemInstance[]> = {};
  constructor(id: string, texture: string = id, model: string = id) {
    this.BLOCK = new FBlock(id, [
      {
        name: "block.infinite_forest.transfer_storage",
        texture: [[texture, 0]],
      },
    ]).create();
    /* .setupBlockModel(
        {
          texture,
          model,
        },
        0
      );*/
    TransferStorage.transferBlocklist.push(this.BLOCK.getID());
  }

  public place(coords: Vector, player: int, items: ItemInstance[]) {
    if(items.length === 0) {
        return;
    }
    const region = BlockSource.getDefaultForActor(player);
    const name = Entity.getNameTag(player);
    TransferStorage.storage[name] = items;
    region.setBlock(coords.x, coords.y, coords.z, this.BLOCK.getID(), 0);
    const actor = new PlayerActor(player);
    for (let i = 0; i <= 35; i++) {
      if (items.includes(actor.getInventorySlot(i))) {
        actor.setInventorySlot(i, 0, 0, 0, null);
      } 
    }
  }

  public static destroyEvent(
    coords: Callback.ItemUseCoordinates,
    block: Tile,
    player: int
  ) {
    if (!TransferStorage.transferBlocklist.includes(block.id)) {
      return;
    }
    const name = Entity.getNameTag(player);
    const storage = TransferStorage.storage[name];
    if (name in storage) {
      const actor = new PlayerActor(player);
      for (const item of storage) {
        actor.addItemToInventory(
          item.id,
          item.count,
          item.data,
          item.extra || null,
          false
        );
      }
      delete TransferStorage.storage[name];
    } else {
      const client = Network.getClientForPlayer(player);
      Game.prevent();
      client &&
        BlockEngine.sendUnlocalizedMessage(
          client,
          Native.Color.GREEN,
          Translation.translate("message.infinite_forest.alien_storage")
        );
    }
  }

  static {
    Callback.addCallback("DestroyBlock", TransferStorage.destroyEvent);

    Saver.addSavesScope(
      "infinite_forest.transfer_storage",
      function read(scope) {
        TransferStorage.storage = scope.transfer_storage ??=
          TransferStorage.storage;
      },
      function save() {
        return { transfer_storage: TransferStorage.storage };
      }
    );
  }
}
