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

  export const recipes = {
      data: {},
      registry(obj: {
          input, output, time
      }): void {
          const {input, output, time} = obj;
          this.data[input] = {
              input: input, output: output, time: time
          });
          if(!!obj || typeof obj !== "object") throw new Error("You must register recipe in object format!")
      },
      hasRecipe(obj: {input, output, result _timer, },container, data) {
          const {input, output, result_timer} = obj;
const slot = container.getSlot("slot").id;
          if(input === slot) {
              if(data.result_timer < result_timer)
    {return data.result_timer++};
    if(data.result_timer >= result_timer) {
        container.setSlot("slot", output, 1, 0, null);
        return true;
    }
          }
      }
  };
  
  export class Worker extends TileEntityBase {
    useNetworkItemContainer: true;
    defaultValues = {
      boiling: false as boolean,
      timer: 0 as number,
      AnimationI: new Animation.Item(this.x + 0.5, this.y + 1.5, this.z + 0.5),
      AnimationB: new Animation.Base(this,x + 0.5, this.y + 0.5, this.z + 0.5)
    };
    public getScreenByName(): UI.StandartWindow {
      return GUI;
    }
  
    onLoad(): void {
      Game.message("Котёл прошёл инитиализацию!")
    };
    public decreaseItem(container, item, player) {
      this.container.getSlot("slot"); 
        container.setSlot("slot", item.id, 1, item.data, null);
        Entity.setCarriedItem(player, item.id, item.count, item.data, null);
        return this;
    };
    onItemUse(
      coords: Callback.ItemUseCoordinates,
      item: ItemStack,
      player: number
    ): boolean {
      const slot = this.container.getSlot("slot");
      const AnimationI = this.data.AnimationI;
      if (slot.count == 0) {
        
        this.decreaseItem(container, item, player)

        AnimationI.describeItem({
          id: slot.id,
          count: slot.count,
          data: slot.data,
        });

         AnimationI.setItemRotation(this.x + 90, this.y, this.z);
        
        AnimationI.setItemSize(1.5);
        
        AnimationI.load();
        
      } else if (slot.count > 0) {
        AnimationI.destroy();
        
        Entity.setCarriedItem(player, slot.id, 1, 0, null),
          this.container.setSlot("slot", 0, 0, 0);
      }
      Game.message("Id of container: " + slot.id);

      return true;
    };
    onTick(): void {
        const {timer, boiling, AnimationI} = this.data;
        const {x, y, z} = this;
      if (World.getThreadTime() % 60 == 0) {
          if(!boiling) {
               timer < 20 ? timer++;       boiling = true }
        
        Game.message("its test tick");
      };
 if(boiling && World.getThreadTime()%5==0) { 
      AnimationI.setPos(x, (y != this.y - 0.4 ?  y -= 0.1 : y += 0.1), z);
        AnimationI.setItemRotation(this.x, ( y < 120 ? y++ : y--), z);
       Game.message("Котёл закипел") }
    }
    onUnload(): void {
      this.data.AnimationB.destroy();
      this.data.AnimationI.destroy();
    }
  }
  TileEntity.registerPrototype(BlockID["iron_cauldron"], new Worker());
  //  BLOCK.registerTile(new Worker());
}
