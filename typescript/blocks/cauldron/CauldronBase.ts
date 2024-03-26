namespace Cauldron {
    
  export class CauldronBase extends TileEntityBase {
    defaultValues = {
      water: false,
      boiling: false as boolean,
      timer: 0 as number,
      selected_slot: 0,
    };

    protected decreaseItem(
      container: ItemContainer,
      item: ItemStack,
      player: int
    ) {
      const select = this.data.selected_slot;
      const count_validate = item.count <= 5 ? item.count : 1;
      this.container.getSlot("slot_" + select);
      return (
        container.setSlot(
          "slot_" + select,
          item.id,
          count_validate,
          item.data,
          null
        ),
        Entity.setCarriedItem(
          player,
          item.id,
          item.count - count_validate,
          item.data,
          null
        )
      );
    }

    protected setItemFromSlot(animation, player, slot) {
      return (
        Entity.setCarriedItem(player, slot.id, slot.count, slot.data, null),
        this.container.setSlot(slot, 0, 0, 0),
        alert("Только что слот " + String(slot) + "был очищен"),
        animation.describeItem({
          id: 0,
        }),
        animation.load(),
        this.data.selected_slot > 0 ? this.data.selected_slot-- : null
      );
    };

    public static damageByBoiling (player) {
      if(Game.getGameMode() === EGameMode.CREATIVE) return;
         return Entity.damageEntity(player, 1),
          Game.tipMessage(Native.Color.AQUA + Translation.translate("Its hot!"))
    };
    protected setItemToSlot(animation: Animation.Item, player, item, slot) {
      const size = hasBlock(item.id) ? 0.1 : 0.4;
      return (
        this.decreaseItem(this.container, item, player),
        animation.describeItem({
          id: item.id,
          count: slot.count,
          data: item.data,
        }),
        animation.setPos(this.x + 0.5 + randomInt(0.0001, 0.0004), this.y + 1.2, this.z + 0.5
        ),
        animation.setItemSizeAndRotation(size, randomInt(0.1, 0.9), randomInt(0.1, 0.9), Math.PI / 2 ),
        animation.load(),
        Game.message(
          "Только что предмет: " +
            slot.id +
            "; был зачислен в слот: " +
            this.data.selected_slot
        ),
        this.data.selected_slot <= 7 ? this.data.selected_slot++ : null
      );
    };
    protected rotateItems (animation: Animation.Item) {
      const coord = (value1: int, value2: int) => !!this.data.boiling ? value1 : value2
   animation.transform().rotate(coord(0.008, 0.003),
    coord(0.006, 0.001),
     randomInt(0.001, 0.003));
      animation.refresh();
    
    };
    protected hasBoiling() {
      
         return (this.data.boiling && this.data.water) === true; }

  damageUp(y) {
    if(Entity.getPosition(Player.get()).y === y + 1) {
         CauldronBase.damageByBoiling(Player.get())
    } 
  }

}
}