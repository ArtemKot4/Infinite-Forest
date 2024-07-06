class Book {
  public ITEM: FItem;
  constructor(id: string, texture: string = id) {
    this.ITEM = new FItem(id, 1, null, texture);
  };
  onUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number) {
  }
}

const LearningBook = new Book("learning_book");

Callback.addCallback("EntityAdded", (entity) => {
  if (Entity.getType(entity) !== Native.EntityType.PLAYER) return;
  const actor = new PlayerActor(entity);
  for (let i = 0; i < 36; i++) {
    if (actor.getInventorySlot(i).id === LearningBook.ITEM.getID()) {
      return;
    }
  };
  actor.addItemToInventory(LearningBook.ITEM.getID(), 1, 0, null, false);
});
