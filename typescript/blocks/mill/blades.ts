namespace Mill {
 

  class Blades extends MultiBlock {
    public defaultValues = {
      work: false,
      speed: 0,
    };
    public actionStation(x, z) {

      return (
        this.blockSource.getBlockId(x, this.y, z) === EMillID.BLADES_STATION
      );
    }

    public destroyIfCondition() {

      const dialog = () => FBlock.destroyByMessage(
        "You need a blades station!",
        this.blockSource,
        this
      );
      
   //block checks for place if condition is do not valid
      let height = [];
   
      for (let i = 1; i <= 5; i++) {
        if (this.blockSource.getBlockId(this.x, this.y - i, this.z) === AIR) {
          height.push(0);
        }
      };

      if (height.length < 5) {
        return FBlock.destroyByMessage(
          "So little distance!",
          this.blockSource,
          this
        );
      }


      if (
        !!!this.actionStation(this.x, this.z + 1)
      ) {
        if(!!this.actionStation(this.x, this.z - 1)) return;
        if(!!this.actionStation(this.x + 1, this.z)) return;
        if(!!this.actionStation(this.x - 1, this.z)) return;
        return dialog();
      }
    }
    researchBlocksToBottom() {
      for (let i = 1; i <= 15; i++) {
        if (this.blockSource.getBlockId(this.x, this.y - i, this.z) === AIR) {
          i < 10 ? (this.data.speed += 0.001) : (this.data.speed += 0.01);
        } else {
          break;
          return;
        }
      }
    };

    init(): void {
      this.destroyIfCondition();
      this.researchBlocksToBottom();
      const getStation = (x, z) => this.getBlock(x, this.y, z, EMillID.BLADES_STATION);
      const y = !getStation(this.x, this.z + 1) &&
      !getStation(this.x, this.z - 1) ?
      (!getStation(this.x + 1, this.z) ? 90 : -90) :
       !getStation(this.x, this.z + 1) ? 180 : 0;
       //@ts-ignore
          this.coords = {
            x: y === 90 || y === -90 ? this.data.speed : 0,
            z: y === 180 || y === 0 ? this.data.speed : 0
          }

      //@ts-ignore
      const animation = (this.animation = generateBlades(this, 0, y, 0));
      animation.load();
    }

    onTick(): void {
      //@ts-ignore
      if (!this.animation) return;

      //@ts-ignore
      const animation = this.animation as Animation.Base;
      if(this.data.work){
      animation.load();
      //@ts-ignore
    animation.transform().rotate(this.coords.x, 0, this.coords.z );
      animation.refresh();
      }

      if(World.getThreadTime()% 60 === 0) {
        this.data.speed = 0;
        this.researchBlocksToBottom();
      };

    }
    destroy(): boolean {
      //@ts-ignore
      this.animation.destroy();
      //@ts-ignore
      this.animation = null;
      return false;
    };

  onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
    if(!!!this.data.work){ //@ts-ignore
    const animation = this.animation as Animation.Base;
    //@ts-ignore
    const coords_ = this.coords;
    animation.load();
    animation.transform().rotate(coords_.x, 0, coords_.z, );
    animation.refresh();
      } else {
      bladesHurt(player);
      };
  };
  }

  TileEntity.registerPrototype(EMillID.BLADES, new Blades());

}
