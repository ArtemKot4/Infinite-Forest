namespace Mill {

  export interface ModelData  {
    model: string,
    texture: string
  };

  class Blades extends MultiBlock {

    public modelData: ModelData;

    constructor(modelData: ModelData) {
      super();
        this.modelData = modelData
    };

    public defaultValues = {
      work: false,
      speed: 0,
      height: 0,
      size: 0,
    };
    public actionStation(x, z) {
      return (
        this.blockSource.getBlockId(x, this.y, z) === EMillID.BLADES_STATION
      );
    }

    public updateSize() {
      if (!!this.data.size) return;
      const height = this.data.height;
      const size = height < 15 ? 2.5 : height / 6.7;
      this.data.size = size;
    }
    public destroyIfCondition(animation: Animation.Base) {
      const dialog = (message) => {
        FBlock.destroyByMessage(message, this.blockSource, this);
        animation.destroy();
      };
      //block checks for place if condition is do not valid
      let height = [];

      for (let i = 1; i <= 5; i++) {
        if (this.blockSource.getBlockId(this.x, this.y - i, this.z) === AIR) {
          height.push(0);
        }
      }

      if (height.length < 5) {
        return dialog("So little distance!");
      }

      if (!!!this.actionStation(this.x, this.z + 1)) {
        if (!!this.actionStation(this.x, this.z - 1)) return;
        if (!!this.actionStation(this.x + 1, this.z)) return;
        if (!!this.actionStation(this.x - 1, this.z)) return;
        return dialog("You need a blades station!");
      }
    }

    researchBlocksToBottom() {
      for (let i = 1; i <= 50; i++) {
        if (this.blockSource.getBlockId(this.x, this.y - i, this.z) === AIR) {
        //if(!!!this.data.speed) 
        i < 20 ? (this.data.speed += 0.001) : (this.data.speed += 0.005);
          this.data.height += 1;
        } else {
          break;
          return;
        }
      }
    }

    init(): void {
      this.researchBlocksToBottom();
      this.updateSize();

      const getStation = (x, z) =>
        this.getBlock(x, this.y, z, EMillID.BLADES_STATION);
      const y =
        !getStation(this.x, this.z + 1) && !getStation(this.x, this.z - 1)
          ? !getStation(this.x + 1, this.z)
            ? 90
            : -90
          : !getStation(this.x, this.z + 1)
          ? 180
          : 0;
      //@ts-ignore
       this.coords = {
        x: y === 90 || y === -90 ? this.data.speed : 0,
        z: y === 180 || y === 0 ? this.data.speed : 0,
      };

      //было height < 20 ? 2.5 : height / 7
      //@ts-ignore
      const animation = (this.animation = generateBlades(
        this,
        0,
        y,
        0,
        this.modelData.model,
        this.modelData.texture,
        this.data.size
      ));
      animation.load();
      this.destroyIfCondition(animation);
    }

    onTick(): void {
      //@ts-ignore
      if (!this.data.work) return;

      //@ts-ignore
      const animation = this.animation as Animation.Base;

      if (World.getThreadTime() % 10 === 0) {
        spawnParticle(
          EParticleType.CRIT,
          this.x + 0.5,
          this.y + 0.5,
          this.z + 0.5,
          Math.random() / 20,
          Math.random() / 20,
          Math.random() / 20
        );
      }

      animation.load();
      //@ts-ignore
      animation.transform().rotate(this.coords.x, 0, this.coords.z);
      animation.refresh();
    }
    destroy(): boolean {
      //@ts-ignore
      this.animation.destroy();
      //@ts-ignore
      this.animation = null;
      return false;
    }

    onItemUse(
      coords: Callback.ItemUseCoordinates,
      item: ItemStack,
      player: number
    ) {
      if (!!!this.data.work) {
        //@ts-ignore
        const animation = this.animation as Animation.Base;
        //@ts-ignore
        const coords_ = this.coords;
        animation.load();
        this.data.height < 30 &&
          animation.transform().rotate(coords_.x, 0, coords_.z);
        animation.refresh();
      } else {
        bladesHurt(player, this.data.height);
      }
    }
  }

  TileEntity.registerPrototype(EMillID.EUCALYPTUS_BLADES, new Blades({
    model: "mill_blades",
    texture: "mill_blades"
  }));
}
