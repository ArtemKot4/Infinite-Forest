namespace Cauldron {
  export const BLOCK = new AdvancedBlock(
    "iron_cauldron",
    [
      {
        name: "Bark Pink Log",
        texture: [["iron_cauldron", 0]],
        inCreative: true,
      },
    ],
    {
      model: "iron_cauldron",
      texture: "iron_cauldron",
    }
  );
  //  BLOCK.visual();

  export const GUI = new UI.StandardWindow({
    elements: {
      slot: { type: "slot" },
    },
  });

  export class Worker extends TileEntityBase {
    useNetworkItemContainer: true;
    AnimationB: Animation.Base;
    AnimationI: Animation.Item;
    defaultValues = {
      boiling: false as boolean,
      timer: 0 as number
    };
    public getScreenByName(): UI.StandartWindow {
      return GUI;
    }

    onLoad(): void {
      this.AnimationB = new Animation.Base(this.x, this.y, this.z);
      this.AnimationI = new Animation.Item(
        this.x + 0.5,
        this.y + 1.5,
        this.z + 0.5
      );
      this.AnimationI.setItemSize(1.5);
    }
    onItemUse(
      coords: Callback.ItemUseCoordinates,
      item: ItemStack,
      player: number
    ): boolean {
      const slot = this.container.getSlot("slot");
      if (slot.count == 0) {
        this.container.setSlot("slot", item.id, 1, 0);
        Entity.setCarriedItem(player, item.id, item.count - 1, item.data, null);

        this.AnimationI.describeItem({
          id: slot.id,
          count: slot.count,
          data: slot.data,
        });

        this.AnimationI.setItemRotation(this.x + 90, this.y, this.z);
        this.AnimationI.load();
      } else if (slot.count > 0) {
        this.AnimationI.destroy();
        Entity.setCarriedItem(player, slot.id, 1, 0, null),
          this.container.setSlot("slot", 0, 0, 0);
      }
      Game.message("Id of container: " + slot.id);

      return true;
    }
    onTick(): void {
      if (World.getThreadTime() % 60 == 0) {
        this.AnimationI.setPos(this.x, (this.y += 0.1), this.z);
        Game.message("its test tick");
      }
    }
    onUnload(): void {
      this.AnimationB.destroy();
      this.AnimationI.destroy();
    }
  }
  TileEntity.registerPrototype(BlockID["iron_cauldron"], new Worker());
  //  BLOCK.registerTile(new Worker());
}
