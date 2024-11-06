namespace Mill {
  class Main extends MultiBlock {
    public defaultValues = {
      electric: false,
      wind: false,
      converter: false,
    };
    public onTick(): void {}
    public onItemUse(
      coords: Callback.ItemUseCoordinates,
      item: ItemStack,
      player: number
    ) {
      const y = this.getBlockByHeight(50, EMillID.BLADES_STATION);

      if (!this.getBlock(this.x, this.y + y, this.z, EMillID.BLADES_STATION)) {
        return Game.tipMessage(
          Native.Color.GREEN + Translation.translate("You need a station")
        );
      }
      this.setBlockDatas(this.x, this.y + y, this.z, "power", true);
    };

    destroy(): boolean {
      const y = this.getBlockByHeight(50, EMillID.BLADES_STATION);
      if(this.getBlock(this.x, this.y + y, this.z, EMillID.BLADES_STATION)) {
        this.setBlockDatas(this.x, this.y + y, this.z, "power", false);
      };
      return false
    }
  }

  TileEntity.registerPrototype(EMillID.MAIN_BLOCK, new Main());
}
