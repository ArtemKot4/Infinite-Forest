namespace Cauldron {
  export const BLOCK = new AdvancedBlock(
    "iron_cauldron",
    [
      {
        name: "Iron cauldron",
        texture: [["iron_cauldron", 0]],
        inCreative: true,
      },
    ],
    {
      model: "iron_cauldron",
      texture: "iron_cauldron",
    }
  );
  BLOCK.visual();

  const content = { elements: {} };

  for (let i = 0; i < 9; i++) {
    content.elements["slot_" + i] = {
      type: "slot",
    };
  }

  alert(JSON.stringify(content));

  export const GUI = new UI.StandardWindow(content);

  export const recipes = {
    data: {},
    registry(obj: { input; output; time }): void {
      const { input, output, time } = obj;
      this.data[input] = {
        input: input,
        output: output,
        time: time,
      };
      if (!!obj || typeof obj !== "object")
        throw new Error("You must register recipe in object format!");
    },
    hasRecipe(obj: { input; output; result_timer }, container, data) {
      const { input, output, result_timer } = obj;
      const slot = container.getSlot("slot").id;
      if (input === slot) {
        if (data.result_timer < result_timer) {
          return data.result_timer++;
        }
        if (data.result_timer >= result_timer) {
          container.setSlot("slot", output, 1, 0, null);
          return true;
        }
      }
    },
  };

  export class Worker extends TileEntityBase {
    useNetworkItemContainer: true;
    defaultValues = {
      boiling: false as boolean,
      timer: 0 as number,
      AnimationI: [],
      AnimationB: new Animation.Base(this.x + 0.5, this.y + 0.5, this.z + 0.5),
      selected_slot: 0,
    };
    getScreenName(player: number, coords: Callback.ItemUseCoordinates): any {
      return GUI
    }
   created(): void {
     const animation = new Animation.Item(this.x + 0.5, this.y + 1.2, this.z + 0.5);
     animation.setItemSize(0.2)
     animation.setItemRotation(this.x + 0.90, this.y, this.z)
      for (let i = 0; i < 9; i++) {
        this.data.AnimationI.push(
         animation
        );
      }
      Game.message("Котёл прошёл инитиализацию! " + JSON.stringify(this.data.AnimationI));
    }
    private decreaseItem(
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
        Entity.setCarriedItem(player, item.id, item.count - count_validate, item.data, null)
      );
    }

    onItemUse(
      coords: Callback.ItemUseCoordinates,
      item: ItemStack,
      player: number
    ): boolean {
      this.container.close()
      const select = this.data.selected_slot as number;
      const slot = this.container.getSlot("slot_" + select);
      const animation = this.data.AnimationI[select] as Animation.Item;
      if (slot.count == 0 && item.id != 0) {
        this.decreaseItem(this.container, item, player);
        animation.describeItem({
          id: item.id,
          count: slot.count,
          data: item.data,
        });
        animation.refresh()
        animation.load();
        alert(
          "Только что предмет: " + slot.id + "; был зачислен в слот: " + select
        );
        this.data.selected_slot <= 7 ? this.data.selected_slot++ : null;
      } else if (slot.count > 0 && item.id == 0) {
        Entity.setCarriedItem(player, slot.id, slot.count, slot.data, null);
        this.container.setSlot("slot_" + select, 0, 0, 0);
        alert("Только что слот " + select + "был очищен");
        animation.describeItem({
          id: 0
        }
        )
        animation.refresh()
        this.data.selected_slot > 0 ? this.data.selected_slot-- : null;
      }
      return true;
    }

    onTick(): void {
      const timer = this.data.timer;
      const boiling = this.data.boiling;
      
      if (sec(3)) {
        if (!boiling && timer < 10) {
          Game.message(String("timer value: " + timer));
          this.data.timer++;
        }
      } else if (timer == 10) {
        Game.message("boiling = true"), (this.data.boiling = true), (this.data.timer = 11);
      }
      if (boiling && tick(10) ) {
        Game.message("Котёл закипел");
        for (const i in this.data.AnimationI) {
          const AnimationI = this.data.AnimationI[i] as Animation.Item;
          // AnimationI.setPos(
          //   this.x,
          //   this.y != this.y - 0.4 ? (this.y -= 0.1) : (this.y += 0.1),
          //   this.z
          // );

         AnimationI.setItemRotation(this.x + 0.1, this.y < 0.20 ? (this.y += 0.1) : this.y -= 0.1, this.z + 0.1);
        }
      }
    }
    destroyBlock(): void {
      this.data.AnimationB.destroy();
      for (const i in this.data.AnimationI) {
        this.data.AnimationI[i].destroy();
      }
      this.data.AnimationI = [];
    }
  }

  TileEntity.registerPrototype(BlockID["iron_cauldron"], new Worker());
  //  BLOCK.registerTile(new Worker());
}
