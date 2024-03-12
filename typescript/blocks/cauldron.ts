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

  for (let i = 1; i <= 9; i++) {
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
    };
    onLoad(): void {
      Game.message("Котёл прошёл инитиализацию!");
    }
    public decreaseItem(container, item, player) {
      this.container.getSlot("slot");
      container.setSlot("slot", item.id, 1, item.data, null);
      Entity.setCarriedItem(player, item.id, item.count, item.data, null);
      return this;
    }
    onItemUse(
      coords: Callback.ItemUseCoordinates,
      item: ItemStack,
      player: number
    ): boolean {
      for (let i = 1; i <= 9; i++) {
        const slot = this.container.getSlot("slot_" + i);
        const AnimationI = this.data.AnimationI as Animation.Item[];
        const length = AnimationI.length - 1;
        if (slot.count == 0) {
          this.decreaseItem(this.container, item, player);
          AnimationI.push(
            new Animation.Item(this.x + 0.5, this.y + 1.5, this.z + 0.5)
          );

          AnimationI[length].describeItem({
            id: item.id,
            count: item.count,
            data: item.data,
          });

          AnimationI[length].setItemRotation(this.x + 0.90, this.y, this.z);

           AnimationI[length].setItemSize(1.5);

          AnimationI[length].load();
          return;
        } else if (slot.count > 0) {
          alert("Anim destroy: count item > 0")
          AnimationI[length].destroy();
          AnimationI.shift();
          Entity.setCarriedItem(player, slot.id, 1, 0, null),
            this.container.setSlot("slot_" + i, 0, 0, 0);
          return;
        }

        Game.message("Id of container: " + slot.id);
      }
      return true;
    }

    onTick(): void {
      let { timer, boiling, AnimationI } = this.data;
      let { x, y, z } = this;
      if (sec(3)) {
        if (!boiling && timer < 20) {
          Game.message(String("timer value: " + timer));
          timer++
        }
      } else if (timer == 20) { 
       Game.message("boiling = true"), (boiling = true) };
      if (boiling && tick(5)) {
        Game.message("Котёл закипел");
        for (const i in AnimationI) {
          AnimationI[i].setPos(
            x,
            y != this.y - 0.4 ? (y -= 0.1) : (y += 0.1),
            z
          );
          AnimationI[i].setItemRotation(this.x, y < 120 ? y++ : y--, z);
        }
      }
    }
    onUnload(): void {
      this.data.AnimationB.destroy();
      this.data.AnimationI.destroy();
    }
  }

  TileEntity.registerPrototype(BlockID["iron_cauldron"], new Worker());
  //  BLOCK.registerTile(new Worker());
}
