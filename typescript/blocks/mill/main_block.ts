namespace Mill { 

class Main extends MultiBlock {
    public defaultValues = {
       electric: false,
       wind: false,
       converter: false        
    };
    public getBlockByHeight (height, id): any {
        for(let i = 1; i < height; i++) {
        if(this.getBlock(this.x, this.y + i, this.z, id)) {
          return i
        }
        }
      return 0
    }
  public onTick(): void {
    if(World.getThreadTime() % 20 * 10 === 0){
      const y = this.getBlockByHeight(50, EMillID.BLADES_STATION)
      Game.message("высота станции над " + y)
      if(!!this.getBlockByHeight(50, EMillID.BLADES_STATION)) {
this.getBlockDatas(this.x, y, this.z, "power")
      }
      };
    }
      public onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
        const y = this.getBlockByHeight(50, EMillID.BLADES_STATION);
        this.setBlockDatas(this.x, y, this.z, "power", true)
        Game.message(this.getBlockDatas(this.x, y, this.z, "power"))
      
      };


}

TileEntity.registerPrototype(EMillID.MAIN_BLOCK, new Main())

}