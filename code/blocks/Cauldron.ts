const WaterMesh = new RenderMesh();
WaterMesh.addVertex(-6 / 16, 0, -6 / 16, 0, 0);
WaterMesh.addVertex(6 / 16, 0, -6 / 16, 1, 0);
WaterMesh.addVertex(-6 / 16, 0, 6 / 16, 0, 1);

WaterMesh.addVertex(6 / 16, 0, -6 / 16, 1, 0);
WaterMesh.addVertex(-6 / 16, 0, 6 / 16, 0, 1);
WaterMesh.addVertex(6 / 16, 0, 6 / 16, 1, 1);


abstract class CaulronRecipe {
  protected constructor() {};
  public static list: {input: int[], output: int}[] = [];
  /**
   * @param output result id of your recipe 
   * @param input your items for forming recipe, max is 9, min is 1
   */
  public static add(output: int, ...input: int[]) {
    while(input.length < 9) {
       input.push(0);
    };
    this.list.push({input: input, output: output});
    alert(input.length)
  }
}

CaulronRecipe.add(BlockID["salt"], VanillaBlockID.bone_block);

class Caulron extends TileEntityBase {
  public static BLOCK: FBlock = new FBlock("iron_cauldron", [
    {
      name: "Iron cauldron",
      texture: [["iron_cauldron", 0]],
      inCreative: true,
    },
  ])
    .createWithRotation()
    .setupBlockModel({ model: "iron_cauldron" })
    .setDestroyLevel(MiningLevel.STONE);
  public animation: Animation.Base;
  public item_animations: Animation.Item[];
  public static TIMER_MAX = 250;
  public static SLOT_MAX = 9;
  public static PROGRESS_MAX = 200;
  public defaultValues = {
    boiling: false,
    water: false,
    progress: 0,
    timer: 0,
  };
  data: { boiling: boolean; water: boolean; progress: int; timer: int };
  animations: Animation.Item[];
  public getCurrentSlotName(): string {
    for (let i = 0; i < Caulron.SLOT_MAX; i++) {
      const slot = this.container.getSlot("slot_" + i);
      if (slot.id !== 0) {
        return "slot_" + (i === Caulron.SLOT_MAX ? Caulron.SLOT_MAX : i + 1);
      }
    }
  }
  public setCurrentSlot(instance: ItemInstance) {
    const currentSlotName = this.getCurrentSlotName();
    const currentSlot = this.container.getSlot(currentSlotName);
    if (currentSlot.count + instance.count) return;
    return this.container.setSlot(
      currentSlotName,
      instance.id,
      currentSlot.count + instance.count,
      instance.data,
      instance.extra || null
    );
  }
  getCurrentSlot(instance: ItemInstance) {
    return this.container.getSlot(this.getCurrentSlotName());
  }
  public takeCurrentSlot(player: int): void {
    const currentSlotName = this.getCurrentSlotName();
    const currentSlot = this.container.getSlot(currentSlotName);
    PlayerHelper.takeItemInstance(player, currentSlot);
    this.setCurrentSlot(new ItemStack());
  }
  @BlockEngine.Decorators.NetworkEvent(Side.Client)
  public createWaterAnimation(data: {}) {
      this.animation = new Animation.Base(
        this.x + 0.5,
        this.y + 1.1,
        this.z + 0.5
      );
      this.animation.describe({
        mesh: WaterMesh,
        skin: "terrain-atlas/water/water_0.png",
   //     material: "translurency",
      });
      this.animation.load();
    }
  @BlockEngine.Decorators.NetworkEvent(Side.Client)
  public sendBubbleParticle(data: {}) {
    for (let i = 0; i <= randomInt(1, 3); i++) {
      Particles.addParticle(
        EForestParticle.CAULDRON_BUBBLE,
        0.25,
        1.1,
        randomInt(0.25, 0.65),
        0.05,
        0.001,
        0.05
      );
      Particles.addParticle(
        EForestParticle.CAULDRON_BUBBLE,
        randomInt(-0.25, 0.65),
        1.1,
        0.25,
        0.05,
        0.001,
        0.05
      );
    }
    return;
  }
  @BlockEngine.Decorators.NetworkEvent(Side.Client)
  public destroyWaterAnimation() {
    this?.animation?.destroy();
  }
  public manipulateWater(item: ItemStack, player: int) {
    const entity = new PlayerEntity(player);
    if (this.data.water === false) {
      if (item.id === VanillaItemID.water_bucket) {
        this.data.water = true;
        this.sendPacket("createWaterAnimation", {});
        entity.setCarriedItem(VanillaItemID.bucket, 1, 0);
      }
    } else if (item.id === VanillaItemID.bucket) {
      this.data.water = false;
      entity.setCarriedItem(VanillaItemID.water_bucket, 1, 0);
      this.sendPacket("destroyWaterAnimation", {});
    }
    return;
  }
  public onLoad(): void {
    this.animations ??= [];
    if(this.data.water === true) {
      this.sendPacket("createWaterAnimation", {});
    }
  }
  public clientUnload(): void {
    this.animation && this.animation.destroy();
  }
  public onItemUse(
    coords: Callback.ItemUseCoordinates,
    item: ItemStack,
    player: number
  ) {
    this.manipulateWater(item, player);
    if(Entity.getSneaking(player)) {
      let res = "";
      for(let i = 0; i < 9; i++) {
           res.concat(Translation.translate(IDRegistry.getNameByID(this.container.getSlot("slot_"+i).id) + "<-  |  ->"))
      };
      Game.message(res);
    };
    if (this.data.boiling === true) {
      return;
    };
  }
  public findFire() {
    if (this.data.boiling === true) return;
    return (
      this.blockSource.getBlockId(this.x, this.y - 1, this.z) ===
      VanillaBlockID.fire
    );
  };
  public recipeWorking() {
    for(const keys of CaulronRecipe.list) {
       for(let index = 0; index < 9; index++) {
        const slot = this.container.getSlot("slot_" + index);
        if(slot.id !== keys.input[index]) {
          alert("!не совпало")
        };
        alert("!совпало");
        for(let i = 0; i < 9; i++) {
          const slot = this.container.getSlot("slot_" + index);
          this.container.setSlot("slot_" + i, slot.id, slot.count-1, slot.data, slot.extra);
        };
             this.container.setSlot("slot_0", keys.output, 1, 0);
             alert("!рецепт успешен")      
       };
       
    }
  }
  public onTick() {
    if (World.getThreadTime() % 10 === 0) {
      if (this.findFire()) {
        this.data.timer++;
        if (this.data.timer === Caulron.TIMER_MAX && this.data.water === true) {
          this.data.boiling = true;
        }
      } else {
        this.data.boiling = false;
      }
    }
    if (this.data.boiling === true) {
      if (World.getThreadTime() % 10 === 0) {
        this.sendPacket("sendBubbleParticle", {});
      };
      if(World.getThreadTime() % 25 === 0) {
        this.recipeWorking();
      }
    }
  }

  static {
    TileEntity.registerPrototype(this.BLOCK.getID(), new Caulron());
  }
}
