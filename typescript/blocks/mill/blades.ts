namespace Mill {
  class Blades extends MultiBlock {
    public defaultValues = {
      work: false,
      speed: 5
    };
public destroyIfCondition() {
        //block checks for place if condition is do not valid
        for (let i = 1; i <= 5; i++) {
            if (this.blockSource.getBlockId(this.x, this.y - i, this.z) !== VanillaBlockID.air) {
             return FBlock.destroyByMessage("So little distance!", this.blockSource, this);
            }
          };

          if (
            this.blockSource.getBlockId(this.x, this.y, this.z - 1) !==
            EMillID.BLADES_STATION
          ) {
           return FBlock.destroyByMessage("You need a blades station!", this.blockSource, this);
          }
         
};

   researchBlocksToBottom() {
    for(let i = 1; i <= 9; i++) {
       if(this.blockSource.getBlockId(this.x, this.y - i, this.z) !== VanillaBlockID.air) {
             this.data.speed = i; return;
       }
    }
   }
    init(): void {
        this.destroyIfCondition()
      const mesh = new RenderMesh();
      mesh.importFromFile(MODELSDIR + "mill_blades.obj", "obj", {
        scale: [2.5, 2.5, 2.5],
        invertV: false,
        noRebuild: false,
      });
      //@ts-ignore
      const animation = (this.animation = new Animation.Base(
        this.x + 0.5,
        this.y + 0.5,
        this.z + 0.5
      ));
      animation.describe({
        mesh,
        skin: "terrain-atlas/mill/mill_blades.png",
      });
      animation.load();
  this.researchBlocksToBottom();
      
    }

    onTick(): void {
        //@ts-ignore
      if(!this.animation) return;
            //@ts-ignore
      const animation = this.animation as Animation.Base;
      animation.load()
      animation.transform().rotate(0, 0, Number("0.00" + this.data.speed));
      animation.refresh();
      if(World.getThreadTime()%20===0) Game.message(String(Number("0.00" + this.data.speed)));
    };
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
