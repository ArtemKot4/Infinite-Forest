type import_params = {
  translate: [int, int, int];
  scale: [int, int, int];
  invertV: boolean;
  noRebuild: boolean;
};

type model_descriptor = {
  model: string | null;
  onHand: boolean;
};

class AdvancedItem extends FItem {
  public visual: {} = { model: null, texture: null, material: null };
  constructor(
    id: string,
    stack?: number,
    name?: string,
    texture?: texture,
    meta?: number,
    isTech?: boolean
  ) {
    super(id, stack, name, texture, meta, isTech);
  }
  public setModel(
    model: model_descriptor = { model: null, onHand: false },
    texture,
    data?,
    importParams?: import_params | null,
    material?
  ): boolean {
    if (!model.model) return;
    const render = new RenderMesh();
    render.importFromFile(
      MODELSDIR + model + ".obj",
      "obj",
      importParams || null
    );

    model.onHand === true
      ? ItemModel.getForWithFallback(ItemID[this.id], data || 0).setHandModel(
          render,
          MODELSDIR + (texture ?? model.model),
          material || null
        )
      : ItemModel.getForWithFallback(ItemID[this.id], data || 0).setModel(
          render,
          MODELSDIR + (texture ?? model.model),
          material || null
        );
  };
}
