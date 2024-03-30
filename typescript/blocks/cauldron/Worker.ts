namespace Cauldron {
  export class Worker extends CauldronBase {
    useNetworkItemContainer: true;
    getScreenName(player: number, coords: Callback.ItemUseCoordinates): any {
      return GUI;
    }

    init(): void {
      for (let i = 0; i < 9; i++) {
        const animation = this["animation_" + i] = new Animation.Item(
          this.x + 0.5,
          this.y + 1.2,
          this.z + 0.5
        );
        animation.setPos(this.x + 0.5 + randomInt(0.0001, 0.0004), this.y + 1.2, this.z + 0.5
        );
       
      }
    }

    onItemUse(
      coords: Callback.ItemUseCoordinates,
      item: ItemStack,
      player: number
    ): any {
      this.container.close();

              //for debug
              for(let i = 0; i <=8; i++) {
                Game.message("slot_" + i + ": " + this.container.getSlot("slot_" + i).id);
              }
              
      const select = this.data.selected_slot as number;
      const slot = this.container.getSlot("slot_" + select);
      const slot_minus = this.container.getSlot("slot_" + (select - 1)).id;
      const animation = this["animation_" + select] as Animation.Item;

      if (this.hasBoiling()) return Worker.damageByBoiling(player);

      if (slot_minus === EPlants.ELECTRIC_MUSHROOM && item.id === 0) {
        return electric_damage(player);
      }

      if (item.id === VanillaItemID.water_bucket) {
        
      
        //@ts-ignore
        const render = (this.water_render = new Animation.Base(
          this.x + 0.5,
          this.y + 1.1,
          this.z + 0.5
        ));

        render.describe({
          mesh: WATERMESH,
          skin: "terrain-atlas/water/water_0.png",
          material: "translurency",
        });

        render.load();
        this.data.water = true;
        

        
        if(Game.getGameMode() === EGameMode.CREATIVE) return;
        Entity.setCarriedItem(player, VanillaItemID.bucket, 1, 0, null);

      }

      if (!!!this.data.water) return nonWaterDialog(player);

      if (slot.count == 0 && item.id != 0) {
        return this.setItemToSlot(animation, player, item, slot);
      }
      if (slot_minus.count > 0 && Entity.getSneaking(player)) {
        alert("DEBUG: GET ITEM BACK");
        return this.setItemFromSlot(animation, player, slot_minus);
      }
    }
          
    onTick(): void {
      const timer = this.data.timer;
      if (!!this.data.water) {
        for (let i = 0; i <= 8; i++) {
          const slot = this.container.getSlot("slot_" + i);
          const animation = this["animation_" + i];
          if (!animation) return;
          if (
            World.getThreadTime() % 10 === 0 &&
            slot.id === EPlants.ELECTRIC_MUSHROOM
          ) {
            Mushroom.particle(this, 1.2);
            Mushroom.particle(this, 1.2);
            Mushroom.particle(this, 1.2);
          }
          if (slot.count > 0) {
            this.rotateItems(animation);

            if (World.getThreadTime() % 1000 === 0) {
              itemMorph(animation, this.container, "slot_" + i, slot);
            }
          }
        }
      }
      if (sec(3)) {
        if (!this.data.boiling && !!this.data.water && timer < 10) {
          this.damageUp(this.y);
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
        onBurn(this);

        for(const index in recipes.data) {
        this.setupRecipes(index)
        };

      }
    }
    destroyBlock(): void {
      for (let i = 0; i <= 8; i++) {
        this["animation_" + i].destroy();
      }
      !!this["water_render"] && this["water_render"].destroy();
    }
  }

  TileEntity.registerPrototype(BlockID["iron_cauldron"], new Worker());
}
