class AdvancedBlock extends FBlock {
  public mesh: RenderMesh;
  public render: ICRender.Model;
  private modelData;
    constructor(id: string, data);
    constructor(id: string, data, modelData: model_descriptor);
  constructor(
    id: string,
    data: Block.BlockVariation[],
    modelData?: model_descriptor
  ) {
    super(id, data);
    this.modelData = modelData || null;
  }

  public visual(): void {
    const data = this.modelData
    this.mesh = new RenderMesh();
    this.render = new ICRender.Model();
    const render = this.render;
    const mesh = this.mesh;
    mesh.setBlockTexture(data.texture, 0);
    if(!data.importParams) data.importParams = {translate: [0.5, 0, 0.5]}
    if(data && data.importParams && !data.importParams.translate) data.importParams["translate"] = [0.5, 0, 0.5];
    mesh.importFromFile(
      MODELSDIR + data.model + ".obj",
      "obj",
      data.importParams || null
    );
    
    render.addEntry(new BlockRenderer.Model(mesh));
    return BlockRenderer.setStaticICRender(BlockID[this.id], 0, render);
  }
  public placer(
    item: universal,
    condition?: (coords, item, block, player, region: BlockSource) => void,
    data?: int
  ) {
    Item.registerUseFunction(item, (coords, item, block, player) => {
      const region = BlockSource.getDefaultForActor(player);
      if (condition) return condition(coords, item, block, player, region);
      const place = coords.relative;
 
     return (region.setBlock(place.x, place.y, place.z, BlockID[this.id], data || 0),
     TileEntity.addTileEntity(coords.x, coords.y, coords.z, region));
    });
  };
  public registerTile(prototype): void {
    return TileEntity.registerPrototype(BlockID[this.id], prototype)
  }
}
