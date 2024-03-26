namespace Mill { 

class Main extends MultiBlock {
    public defaultValues = {
       electric: false,
       wind: false,
       converter: false        
    };
    public getBlockByHeight (height, id) {
        for(let i = 0; i < height; i++)
        return this.getBlockByTile(this.x, this.y + i, this.z, id);
    }
  public onTick(): void {
      if(this.getBlockByHeight(9, EMillID.BLADES_STATION)) {
        Game.message("BLADES_STATION обнаружен");
      }
  };


}

TileEntity.registerPrototype(EMillID.MAIN_BLOCK, new Main())

}