namespace Mill {

  export function generateBlades(that, x: int = 0, y: int = 0, z: int = 0) {
    const mesh = new RenderMesh();
    mesh.importFromFile(MODELSDIR + "mill_blades.obj", "obj", {
      scale: [2.5, 2.5, 2.5],
      invertV: false,
      noRebuild: false,
    });
      mesh.rotate(VMath.radian(x), VMath.radian(y), VMath.radian(z))
    //@ts-ignore
    const animation = new Animation.Base(
      that.x + 0.5,
      that.y + 0.5,
      that.z + 0.5
    );
    animation.describe({
      mesh,
      skin: "terrain-atlas/mill/mill_blades.png",
    });
    return animation;
  };


  class Blades extends MultiBlock {
    public defaultValues = {
      work: false,
      speed: 0,
    };
    public actionStation(x, z) {

      return this.blockSource.getBlockId(
        x,
        this.y,
        z) === EMillID.BLADES_STATION
    };

    public destroyIfCondition() {
      
      let height = [];
      //block checks for place if condition is do not valid
      for (let i = 1; i <= 5; i++) {
        if (this.blockSource.getBlockId(this.x, this.y - i, this.z) === AIR) {
          height.push(0);
        }
      }
      if (height.length < 5) {
        return FBlock.destroyByMessage(
          "So little distance!",
          this.blockSource,
          this
        );
      };

  Game.message("что возвращает actionStation" + !!this.actionStation)
      if(!!!this.actionStation(this.x, this.z + 1) ?? 
      !!!this.actionStation(this.x, this.z - 1) ) {

        return FBlock.destroyByMessage(
          "You need a blades station!",
          this.blockSource,
          this
        );

      }
       
    }

    researchBlocksToBottom() {
      for (let i = 1; i <= 15; i++) {
        if (this.blockSource.getBlockId(this.x, this.y - i, this.z) === AIR) {
          i < 10 ? (this.data.speed += 0.001) : this.data.speed += 0.01;
        } else {
          break;
          return;
        }
      }
    }
    init(): void {
      this.destroyIfCondition();
      this.researchBlocksToBottom();
      //@ts-ignore
      const animation = this.animation = generateBlades(this);
      animation.load();
    }

    onTick(): void {
      //@ts-ignore
      if (!this.animation) return;
      //@ts-ignore
      const animation = this.animation as Animation.Base;
      animation.load();
      animation.transform().rotate(0, 0, this.data.speed);
      animation.refresh();
      if (World.getThreadTime() % 200 === 0)
        Game.message(String(this.data.speed));
    }
    destroy(): boolean {
      //@ts-ignore
      this.animation.destroy();
      //@ts-ignore
      this.animation = null;
      return false;
    };

  }

  TileEntity.registerPrototype(EMillID.BLADES, new Blades());
}
