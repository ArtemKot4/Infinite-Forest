namespace Mill {

  export const BLADES = [
    EMillID.EUCALYPTUS_BLADES,
    EMillID.PINK_BLADES
  ]

  class BladesStation extends MultiBlock {
    public defaultValues = {
      power: false,
      mesh: generateNumberMesh(this),
      level: randomInt(0, 9)
    };
    init(): void {
      //@ts-ignore
      const animation = (this.animation =
      new Animation.Base(this.x, this.y + 1.1, this.z));
        animation.describe({mesh: this.data.mesh, skin: "font/number_" + this.data.level + ".png"});

      animation.load();
    }
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
    };

    public onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
      if(Entity.getSneaking(player)) {
        Game.message("Уровень" + this.data.level)
        this.data.level < 9 ? this.data.level++ : this.data.level = 0;
        const texture = "font/number_" + this.data.level + ".png";
        //@ts-ignore
        const animation = this.animation as Animation.Base;
        animation.describe({mesh: this.data.mesh, skin: texture});
        animation.load();
        Particles.addParticle(EParticleType.CRIT, this.x + 0.5, this.y + 1.1, this.z + 0.5, 0, 0.03, 0);
      }
    }
  }

  TileEntity.registerPrototype(EMillID.BLADES_STATION, new BladesStation());
}
