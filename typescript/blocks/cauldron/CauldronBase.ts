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
        this.container.setSlot("slot_" + this.data.selected_slot, 0, 0, 0),
        alert("Только что слот " + this.data.selected_slot + "был очищен"),
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
    protected setItemToSlot(animation, player, item, slot) {
      return (
        this.decreaseItem(this.container, item, player),
        animation.describeItem({
          id: item.id,
          count: slot.count,
          data: item.data,
        }),
        animation.load(),
        alert(
          "Только что предмет: " +
            slot.id +
            "; был зачислен в слот: " +
            this.data.selected_slot
        ),
        this.data.selected_slot <= 7 ? this.data.selected_slot++ : null
      );
    };
    protected rotateItems (animation) {
      //@ts-ignore
 if(!this.rotation) alert("NON ROTATION")
      //@ts-ignore
     const x = this.rotation.x < 0.180 ? this.rotation.x+=0.1 : this.rotation.x -= 0.10;
     //@ts-ignore
      const y = this.rotation.y < 0.37 ? this.rotation.y+=0.1 : this.rotation.y-= 0.10;
       //@ts-ignore
      const z = this.rotation.z < 0.100 ? this.rotation.z +=0.1 : this.rotation.z -= 0.10;

      return animation.setItemRotation(x, y, z);
    };
    protected hasBoiling = () => {
        //@ts-ignore
         return (this.data.boiling && this.data.water) === true; }

  damageUp(y) {
    if(Entity.getPosition(Player.get()).y === y + 1 && this.hasBoiling()) {
         CauldronBase.damageByBoiling(Player.get())
    } 
  }

}
}