namespace Cauldron {
export class Worker extends CauldronBase {
    useNetworkItemContainer: true;
    getScreenName(player: number, coords: Callback.ItemUseCoordinates): any {
      return GUI;
    }
    rotation = {x: 0, y: 0, z: 0};
    created(): void {

      for (let i = 0; i < 9; i++) {
        this.data["animation_" + i] = new Animation.Item(
          this.x + 0.5,
          this.y + 1.2,
          this.z + 0.5
        );
        const data = this.data["animation_" + i] as Animation.Item;
        data.setItemSize(0.2);
        data.setItemRotation(this.x + 0.9, this.y, this.z);
      }
    }

    onItemUse(
      coords: Callback.ItemUseCoordinates,
      item: ItemStack,
      player: number
    ): any {

      this.container.close();
      const select = this.data.selected_slot as number;
      const slot = this.container.getSlot("slot_" + select);
      const slot_0 = this.container.getSlot("slot_0").id;
      const animation = this.data["animation_" + select] as Animation.Item;

      if(this.hasBoiling()) Worker.damageByBoiling(player)
      
      if (slot_0 === EPlants.ELECTRIC_MUSHROOM && item.id === 0) {
        return electric_damage(player);
     
      };

      if (item.id === VanillaItemID.water_bucket) {
        //@ts-ignore
        const render = this.water_render = new Animation.Base(this.x, this.y + 0.2, this.z);
  
        render.describe({
          mesh: WATERMESH
        });
    
        render.load();
        this.data.water = true;
        return;
      }

      if (slot.count == 0 && item.id != 0) {
        return this.setItemToSlot(animation, player, item, slot);
      };
      if (slot.count > 0 && item.id == 0) {
        return this.setItemFromSlot(animation, player, slot);
      };
      
    }

    onTick(): void {
      const timer = this.data.timer;
      const boiling = this.data.boiling;

      if (sec(3)) {
        if (!this.hasBoiling() && timer < 10) {
          Game.message(String("timer value: " + timer));
          this.data.timer++;
        }
      } 
      if (timer == 10) {
        Game.message("boiling = true"),
          (this.data.boiling = true),
          (this.data.timer = 11);
      }
      if (this.hasBoiling() && tick(3)) {
        Game.message("Котёл закипел");
        for (let i = 0; i <= 8; i++) {
          const animation = this.data["animation_" + i];

          if (this.container.getSlot("slot_" + i).count > 0) {
            this.rotateItems(animation); }
        }
      }
    }
    destroyBlock(): void {
      this.data.AnimationB.destroy();
      for (let i = 0; i <= 8; i++) {
        this.data["animation_" + i].destroy();
      }
    }
  }

  TileEntity.registerPrototype(BlockID["iron_cauldron"], new Worker());
  //  BLOCK.registerTile(new Worker());
 
}