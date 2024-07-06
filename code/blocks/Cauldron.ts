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
    timer: 0,
  };
  data: { boiling: boolean; timer: int };
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
  public onItemUse(
    coords: Callback.ItemUseCoordinates,
    item: ItemStack,
    player: number
  ) {
    // this.currentSlotLogic(new PlayerEntity(player));
  }
}
