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
  public defaultValues = {
    boiling: false,
    water: false,
  };
  data: { boiling: boolean; water: boolean };
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
  public dropAll(player: int) {
    for (let i = 0; i <= 8; i++) {
      const slot = this.container.getSlot("slot_" + i);
      if (!!slot) {
        this.blockSource.spawnDroppedItem(
          this.x + 0.5,
          this.y + 0.8,
          this.z + 0.5,
          slot.id,
          slot.count,
          slot.data,
          slot.extra
        );
        this.container.clearSlot("slot_" + i);
      }
    }
  };
  @BlockEngine.Decorators.NetworkEvent(Side.Client)
  public createWaterAnimation() {
    if(this.data.water === true) {
    this.animation = new Animation.Base(this.x + 0.5, this.y + 1.1, this.z + 0.5);
    this.animation.describe({mesh: WaterMesh, skin: "terrain-atlas/water/water_0.png", material: "translurency"});
    this.animation.load();
  };
};
@BlockEngine.Decorators.NetworkEvent(Side.Client)
public destroyWaterAnimation() {
  this?.animation?.destroy();
}
  public manipulateWater(item: ItemStack, player: int) {
    const entity = new PlayerEntity(player);
    if(this.data.water === false) {
    if(item.id === VanillaItemID.water_bucket) {
      this.data.water = true;
      this.sendPacket("createWaterAnimation", {});
      entity.setCarriedItem(VanillaItemID.bucket, 1, 0)
    }};
     if(item.id === VanillaItemID.bucket) {
      this.data.water = false;
      entity.setCarriedItem(VanillaItemID.water_bucket, 1, 0)
      this.sendPacket("destroyWaterAnimation", {});
    };
    return;
  };
  public onLoad(): void {
    this.sendPacket("createWaterAnimation", {});
  }
  public onItemUse(
    coords: Callback.ItemUseCoordinates,
    item: ItemStack,
    player: number
  ) {
    // this.currentSlotLogic(new PlayerEntity(player));
    this.manipulateWater(item, player);
    if (this.data.boiling === true) {
      return;
    }
  }
  public onTick() {}
}

 const WaterMesh = new RenderMesh();
WaterMesh.addVertex(-6 / 16, 0, -6 / 16, 0, 0);
WaterMesh.addVertex(6 / 16, 0, -6 / 16, 1, 0);
WaterMesh.addVertex(-6 / 16, 0, 6 / 16, 0, 1);

WaterMesh.addVertex(6 / 16, 0, -6 / 16, 1, 0);
WaterMesh.addVertex(-6 / 16, 0, 6 / 16, 0, 1);
WaterMesh.addVertex(6 / 16, 0, 6 / 16, 1, 1);