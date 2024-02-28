type import_params = {
  translate: [int, int, int];
  scale: [int, int, int];
  invertV: boolean;
  noRebuild: boolean;
};

type model_descriptor = {
  model: string | null,
      texture?: string,
      importParams?: import_params,
      data?: int,
  onHand?: boolean,
};

class AdvancedItem extends FItem {
  constructor( id: string, stack?: int, name?: string, texture?: string, visual?: model_descriptor, meta?: int, isTech?: boolean);
  constructor( id: string, stack?: int, name?: string, texture?: string, meta?, isTech?);
  constructor(
    id: string,
    stack?: number,
    name?: string,
    texture?: texture,
    visual?: model_descriptor,
    meta?: number,
    isTech?: boolean
  ) {
    super(id, stack, name, texture, meta, isTech);
    if(typeof arguments[4] === "object") this.setModel(visual)
  }
  public setModel(
    model: model_descriptor
  ): ItemModel {
    if(!model.importParams) model.importParams = {translate: [0.5, 0, 0.5], scale: null, invertV: false, noRebuild: false}
    if(model && model.importParams && !model.importParams.translate) model.importParams["translate"] = [0.5, 0, 0.5]
    if (!model.model) return;
    const render = new RenderMesh();
    render.importFromFile(
      MODELSDIR + model.model + ".obj",
      "obj",
      model.importParams
    );
    const texture = model.texture ?? model.model;
  return !!model.onHand
      ? ItemModel.getForWithFallback(ItemID[this.id], model.data || 0).setHandModel(
          render,
          texture
         // material || null
        )
      : ItemModel.getForWithFallback(ItemID[this.id], model.data || 0).setModel(
          render,
          texture
         // material || null
        );
  };
}
