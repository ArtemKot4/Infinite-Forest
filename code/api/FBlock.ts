type BlockModelDescriptor = {
  model: string;
  texture?: string;
  scale?: [int, int, int];
  translate?: [int, int, int];
};

class FBlock {
  constructor(
    public id: string,
    public data: Block.BlockVariation[],
    public type?: string | Block.SpecialType
  ) {
    IDRegistry.genBlockID(this.id);
  }
  public create() {
    Block.createBlock(this.id, this.data, this.type);
    return this;
  }

  public setItemModel(
    model: string,
    texture: string,
    import_params?: RenderMesh.ImportParams
  ) {
    const mesh = new RenderMesh();
    mesh.importFromFile(
      MODELSDIR + model + ".obj",
      "obj",
      import_params || null
    );

    ItemModel.getForWithFallback(BlockID[this.id], 0).setModel(
      mesh,
      "models/" + texture
    );
    return this;
  }
  public setupImpovedBlockModel(
    obj: Pick<BlockModelDescriptor, 'model' | 'texture'> & {
      importParams?: RenderMesh.ImportParams;
    }
  ) {
    new BlockModel<string>("block/" + obj.model, obj.importParams).setBlock(
      this.getID(),
      obj.texture
    );
    return this;
  }
  public setupBlockModel(obj: BlockModelDescriptor, data = 0) {
    const mesh = new RenderMesh(
      __dir__ + "/resources/assets/models/" + obj.model + ".obj",
      "obj",
      {
        translate: obj.translate || [0.5, 0, 0.5],
        scale: obj.scale || [1, 1, 1],
        invertV: false,
        noRebuild: false,
      }
    );
    mesh.setBlockTexture(obj.texture ?? obj.model, 0);
    const render = new ICRender.Model();
    render.addEntry(new BlockRenderer.Model(mesh));
    BlockRenderer.setStaticICRender(this.getID(), data || 0, render);
    return this;
  };

  public setupBlockModelFromMesh(mesh: RenderMesh, data = -1) {

    const render = new ICRender.Model();
    render.addEntry(new BlockRenderer.Model(mesh));
    BlockRenderer.setStaticICRender(this.getID(), data || 0, render);
    return this;
  }

  public setSoundType(sound: Block.Sound) {
    BlockRegistry.setSoundType(this.getID(), sound);
    return this;
  };
  public setAnimateTickParticles(particle: EParticleType | EForestParticle, x: int, y: int, z: int, vx: int, vy: int, vz: int) {
      Block.setAnimateTickCallback(this.getID(), (x, y, z, id, data) => {
        Particles.addParticle(particle, x, y, z, vx, vy, vz);
      });
      return this;
  }
  public createWithRotation() {
    Block.createBlockWithRotation(this.id, this.data, this.type);
    return this;
  }
  public setDestroyLevel(level: MiningLevel) {
    Block.setDestroyLevelForID(BlockID[this.id], level);
    return this;
  };
  public setDestroyTime(time: int) {
    Block.setDestroyTime(this.getID(), time)
    return this;
  }
  public getID() {
    return BlockID[this.id];
  }
}
