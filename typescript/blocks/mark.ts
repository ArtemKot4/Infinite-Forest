new FBlock("magical_mark", [{
    name: "Mark",
    texture: [["mark", 0]],
    inCreative: true
}]);

TileEntity.registerPrototype(BlockID["magical_mark"], {
    defaultValues: {base: new Animation.Base(this.x, this.y, this.z)},
   init() {
       const base = this.data.base as Animation.Base;
       const mesh = new RenderMesh();
       mesh.importFromFile(MODELSDIR + "mark.obj", "obj", {
        translate: [0.5, 1.1 ,0.5],
        noRebuild: false,
        invertV: false
       })
       base.describe({
        mesh: mesh, skin: "mark"
       });
       base.load();
   },
   tick() {
       const base = this.data.base as Animation.Base;
       if(World.getThreadTime()%5==0) base.transform().lock().clear().rotate(0, Math.PI, 0).unlock()
   },
})