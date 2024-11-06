class LearningBook {
  public item: FItem;

  constructor(id: string, texture: string = id) {
    this.item = new FItem(id, 1, null, texture);
    this.item.onUseAndNoTarget(this.onUse);
  };
  
  onUse(item: ItemInstance, player: number) {
    return Book.GraphicUI.openFor(player);
  }
}

const BookItem = new LearningBook("learning_book");

Callback.addCallback("EntityAdded", (entity) => {
  if (Entity.getType(entity) !== Native.EntityType.PLAYER) return;
  if (Entity.getOffhandItem(entity).id === BookItem.item.getID()) return;
  const actor = new PlayerActor(entity);
  for (let i = 0; i < 36; i++) {
    if (actor.getInventorySlot(i).id === BookItem.item.getID()) {
      return;
    }
  }
  actor.addItemToInventory(BookItem.item.getID(), 1, 0, null, false);
});
