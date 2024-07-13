class Book {
  public item: FItem;
  constructor(id: string, texture: string = id) {
    this.item = new FItem(id, 1, null, texture);
    this.item.onUseAndNoTarget(this.onUse);
  }
  onUse(item: ItemInstance, player: number) {
    return BookUI.openFor(player);
  }
}

const LearningBook = new Book("learning_book");

Callback.addCallback("EntityAdded", (entity) => {
  if (Entity.getType(entity) !== Native.EntityType.PLAYER) return;
  if (Entity.getOffhandItem(entity).id === LearningBook.item.getID()) return;
  const actor = new PlayerActor(entity);
  for (let i = 0; i < 36; i++) {
    if (actor.getInventorySlot(i).id === LearningBook.item.getID()) {
      return;
    }
  }
  actor.addItemToInventory(LearningBook.item.getID(), 1, 0, null, false);
});
