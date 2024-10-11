namespace Mill {
    export interface importParams {
        scale: [int, int, int];
        translate?: [int, int, int]
        invertV: false;
        noRebuild: false;
      };

      export function bladeMesh(model: string, importParams: importParams) {
        const mesh = new RenderMesh();
        mesh.importFromFile(MODELSDIR + model +".obj", "obj", importParams);
        return mesh;
      };
    
      (() => {
        //collision
      
        // const shape = new ICRender.CollisionShape();
        // shape.addEntry().addBox(8/16, 17/16, -8/16, -24/16, -16/16, -8/16)
        // const render = new BlockRenderer.setCustomCollisionShape(EMillID.BLADES, 0, shape)

        //model
        const model = ItemModel.getForWithFallback(EMillID.EUCALYPTUS_BLADES, 0);
        const mesh = new RenderMesh();
        mesh.importFromFile(MODELSDIR + "mill_blades_item.obj", "obj", { scale: [0.55, 0.55, 0.55],
          translate: [0.5, 0.8, 0.7],invertV: false, noRebuild: false });
        
        mesh.rotate(0, VMath.radian(30), 0);
    
    
        model.setModel(
          mesh,
          "mill_blades"
        );
    
      })();
    
      export function generateBlades(that, x: int = 0, y: int = 0, z: int = 0,
         model: string, texture: string,
         scale: int) { 
        const mesh = bladeMesh( model, {
          scale: [scale, scale, scale],
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
          skin: "terrain-atlas/mill/"+ model + ".png",
        });
        animation.setBlocklightMode()
        return animation;
      };

      export function generateNumberMesh(that): RenderMesh {
        const mesh = new RenderMesh();

        mesh.addVertex(-4 / 16, 0, -4 / 16, 0, 0);
        mesh.addVertex(4 / 16, 0, -4 / 16, 1, 0);
        mesh.addVertex(-4 / 16, 0, 4 / 16, 0, 1);
      
        mesh.addVertex(4 / 16, 0, -4 / 16, 1, 0);
        mesh.addVertex(-4 / 16, 0, 4 / 16, 0, 1);
        mesh.addVertex(4 / 16, 0, 4 / 16, 1, 1); 

           mesh.scale(0.3, 0.3, 0.3);
           

        return mesh
      }
}