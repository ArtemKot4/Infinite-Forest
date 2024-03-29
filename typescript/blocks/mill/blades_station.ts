namespace Mill {
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

    setupWorkToBlades(x, z) {
      if (!this.getBlock(x, this.y, z, EMillID.BLADES)) return;
      this.setBlockDatas(x, this.y, z, "work", this.data.power);
    }
    public destroyIfPlaced(x, z) {
      if (!this.getBlock(x, this.y, z, EMillID.BLADES)) return;
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
