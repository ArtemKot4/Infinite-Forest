namespace Mill {

  export const BLADES = [
    EMillID.EUCALYPTUS_BLADES,
    EMillID.PINK_BLADES
  ];

  (() => { 
  const model = BlockRenderer.createModel();
  model.addBox(0/16, 0/16, 0/16, 16/16, 16/16, 16/16, 
  "mill_blades_station", 0);
  model.addBox(0.1875, 1, 0.1875, 0.8125, 1.0625, 0.8125, "mill_blades_station_display", 0);
  model.addBox( 0.1875, 1.0500, 0.1875, 0.8125, 1.09375, 0.8125, "mill_blades_station_display_glass", 0);
  BlockRenderer.setStaticICRender(EMillID.BLADES_STATION, -1, new ICRender.Model(model));
  })();



  class BladesStation extends MultiBlock {
    public defaultValues = {
      power: false,
      level: 1
    };
    init(): void {
      //@ts-ignore
      const mesh = (this.mesh = generateNumberMesh(this));
      //@ts-ignore
      const animation = (this.animation =
      new Animation.Base(this.x + 0.5, this.y + 1.105, this.z + 0.5));

      animation.setIgnoreLightMode();
            //@ts-ignore
        animation.describe({mesh: this.mesh, skin: "font/number_" + this.data?.level || 0 + ".png"});

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
      //@ts-ignore
      this.animation.destroy()
      return false;
    };

    public onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
      if(Entity.getSneaking(player) === true) {
        this.data.level < 9 ? this.data.level++ : this.data.level = 0;
        const texture = "font/number_" + this.data.level + ".png";
        //@ts-ignore
        const animation = this.animation as Animation.Base;
        //@ts-ignore
        animation.describe({mesh: this.mesh, skin: texture});
        animation.load();

     Mushroom.particle(this, 1.1);
        return;

      };
      //@ts-ignore
      this.animation.destroy();
      return;
    }
  }

  TileEntity.registerPrototype(EMillID.BLADES_STATION, new BladesStation());
}
