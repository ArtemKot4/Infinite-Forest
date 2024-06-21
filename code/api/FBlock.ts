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
    IDRegistry.genBlockID(id);
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
      __dir__ + "/resources/assets/models/block/" + obj.model + ".obj",
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
    BlockRenderer.setStaticICRender(BlockID[this.id], data || 0, render);
    return this;
  }

  public createWithRotation() {
    Block.createBlockWithRotation(this.id, this.data, this.type);
    return this;
  }
  public setDestroyLevel(level: MiningLevel) {
    Block.setDestroyLevelForID(BlockID[this.id], level);
    return this;
  }
  public getID() {
    return BlockID[this.id];
  }
}
