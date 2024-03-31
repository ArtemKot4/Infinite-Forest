namespace Mill {

  export const BLADES = [
    EMillID.EUCALYPTUS_BLADES,
    EMillID.PINK_BLADES
  ]

  class BladesStation extends MultiBlock {
    public defaultValues = {
      power: false,
    };
    onTick(): void {

      if (World.getThreadTime() % 200 === 0) {
        this.setupWorkToBlades(this.x + 1, this.z);
        this.setupWorkToBlades(this.x - 1, this.z);
        this.setupWorkToBlades(this.x, this.z - 1);
        this.setupWorkToBlades(this.x, this.z + 1);
      };

      if(!!this.data.power) Mushroom.particle(this, 1.1)
    
    }
    public static getBlades(blockSource: BlockSource,x, y, z) {
      for(const i in BLADES) {
        if(blockSource.getBlockId(x, y, z) === BLADES[i]) return true
      }
    };
    setupWorkToBlades(x, z) {
      if(!BladesStation.getBlades(this.blockSource, x, this.y, z)) return;
      this.setBlockDatas(x, this.y, z, "work", this.data.power);
    }
    public destroyIfPlaced(x, z) {
      if(!BladesStation.getBlades(this.blockSource, x, this.y, z)) return;
      TileEntity.getTileEntity(x, this.y, z).animation.destroy();
      this.blockSource.explode(x, this.y, z, 1, false);
    }

    destroy(): boolean {
      this.destroyIfPlaced(this.x + 1, this.z);
      this.destroyIfPlaced(this.x - 1, this.z);
      this.destroyIfPlaced(this.x, this.z + 1);
      this.destroyIfPlaced(this.x, this.z - 1);
      return false;
    }
  }

  TileEntity.registerPrototype(EMillID.BLADES_STATION, new BladesStation());
}
