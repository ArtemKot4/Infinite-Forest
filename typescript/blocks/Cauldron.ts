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
  public static CURRENT_SLOT_MAX;
  public defaultValues = {
    current_slot: 0,
    boiling: false,
    timer: 0,
  };
  data: { current_slot: int; boiling: boolean; timer: int };
  public currentSlotLogic(player: PlayerEntity) {
    if (player.getCarriedItem().id === 0) {
      if (Entity.getSneaking(player.getUid()) === false) {
        this.data.current_slot < Caulron.CURRENT_SLOT_MAX &&
          this.data.current_slot++;
      } else {
        this.data.current_slot > 0 && this.data.current_slot--;
      }
    } else {
      this.data.current_slot < Caulron.CURRENT_SLOT_MAX &&
        this.data.current_slot++;
    }
  };
  public onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
      this.currentSlotLogic(new PlayerEntity(player));
  }
}
