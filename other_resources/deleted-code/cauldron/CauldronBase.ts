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
    }

    public static damageByBoiling(player) {
      if (Game.getGameMode() === EGameMode.CREATIVE) return;
      return (
        Entity.damageEntity(player, 1),
        Game.tipMessage(Native.Color.AQUA + Translation.translate("Its hot!"))
      );
    }
    protected setItemToSlot(animation: Animation.Item, player, item, slot) {
      const size = hasBlock(item.id) ? 0.2 : 0.5;
      //0.5 было 0.3
      return (
        this.decreaseItem(this.container, item, player),
        animation.describeItem({
          id: item.id,
          count: slot.count,
          data: item.data,
        }),
        animation.setItemSizeAndRotation(
          size,
          randomInt(0.1, 0.9),
          randomInt(0.1, 0.9),
          randomInt(85, 105)
        ),
        animation.load(),
        this.data.selected_slot <= 7 ? this.data.selected_slot++ : null
      );
    }
    protected rotateItems(animation: Animation.Item) {
      if (!animation) return;
      const coord = (value1: int, value2: int) =>
        !!this.data.boiling ? value1 : value2;
      animation.transform().rotate(coord(0.009, 0.004),0, coord(0.003, 0.002), );
      animation.refresh();
    }
    public setupRecipes(index) {
      if (!this.data.boiling) return false;
      for(let i = 0; i <= 8; i++){
      const slot = this.container.getSlot("slot_" + i);
      const data = recipes.data[index];
      if (recipes.hasRecipe(this.container, "slot_" + i, data["input_" + i])) {
        this.container.clearSlot("slot_" + i);
        this.container.setSlot("slot_" + randomInt(0, 8),
         data["result"], 1, 0);
         alert("Рецепт выполнился!");
         this["animation_" + i].describeItem({
          id: slot.id,
          data: slot.data,
          count: slot.count
         })
      }
      }
    }
    protected hasBoiling() {
      return (this.data.boiling && this.data.water) === true;
    }

    damageUp(y) {
      if (Entity.getPosition(Player.get()).y === y + 1) {
        CauldronBase.damageByBoiling(Player.get());
      }
    }
  }
}
