namespace Mill {
    export interface importParams {
        scale: [int, int, int];
        translate?: [int, int, int]
        invertV: false;
        noRebuild: false;
      }
      export function bladeMesh(importParams: importParams) {
        const mesh = new RenderMesh();
        mesh.importFromFile(MODELSDIR + "mill_blades.obj", "obj", importParams);
        return mesh;
      };
    
      (() => {
        //collision
      
        // const shape = new ICRender.CollisionShape();
        // shape.addEntry().addBox(8/16, 17/16, -8/16, -24/16, -16/16, -8/16)
        // const render = new BlockRenderer.setCustomCollisionShape(EMillID.BLADES, 0, shape)

        //model
        const model = ItemModel.getForWithFallback(EMillID.BLADES, 0);
        const mesh = bladeMesh({ scale: [0.5, 0.5, 0.5],
          translate: [0.8, 1, 0.7],invertV: false, noRebuild: false });
        mesh.rotate(0, VMath.radian(30), 0);
    
    
        model.setModel(
          mesh,
          "mill_blades"
        );
    
      })();
    
      export function generateBlades(that, x: int = 0, y: int = 0, z: int = 0) { 
        const mesh = bladeMesh({
          scale: [2.5, 2.5, 2.5],
          invertV: false,
          noRebuild: false,
        });
        mesh.rotate(VMath.radian(x), VMath.radian(y), VMath.radian(z));
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
        animation.setBlocklightMode()
        return animation;
      }
}