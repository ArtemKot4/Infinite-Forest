const handItemFunctions = {} as Record<int, (player) => void>;
function checkHandItem(player: int) {
  const actor = new PlayerEntity(player);
  for (const i in handItemFunctions) {
    const id = Number(i);
    if (
      actor.getCarriedItem().id === id &&
      actor.getInventorySlot(actor.getSelectedSlot()).id === id
    ) {
     return handItemFunctions[i](player);
    }
  }
}

type texture = string | [texture: string, frame: int, time?: int];
class FItem {
  protected id: string;
  protected stack: int = 64;
  protected meta: int = 0;
  protected isTech: boolean = false;
  protected texture: string | [string, int, int?];
  protected name: string;
  public static funcs = [];
  constructor(id: string, stack?: int, name?: string, texture?: texture , meta?: int, isTech?: boolean) {
    this.id = id;
    this.stack = stack;
    this.meta = meta;
    this.isTech = isTech;
    this.texture = texture || id;
    this.name = name || id;
    this.create();
  }

  public category(int: int): void {
    Item.setCategory(this.id, int); //?
  }
  public setTool(toolMaterial: string | ToolAPI.ToolMaterial, toolType?: any, brokenId?: number) {
    ToolAPI.setTool(this.getID(), toolMaterial, toolType);
  }
  public create(): void {
    IDRegistry.genItemID(this.id);
    Item.createItem(
      this.id,
      this.name,
      {
        name: !Array.isArray(this.texture) ? this.texture : this.texture[0],
        meta: this.meta,
      },
      { stack: this.stack, isTech: this.isTech }
    );
    if (Array.isArray(this.texture) && this.texture.length > 1) {
      const texture = this.texture;
      IAHelper.makeAdvancedAnim(
        ItemID[this.id],
        texture[0],
        texture.length == 3 ? texture[2] : 2,
        range(1, texture[1])
      );
    }
  };
  public info(text: string, translation: {}): void {
    Translation.addTranslation(text, translation);
    Item.registerNameOverrideFunction(this.id, function (item, name) {
      Entity.getSneaking(Player.get())
        ? name + "\n§7" + Translation.translate(text)
        : name + "\n§7" + "Info is locked"; //? надпись требует переработки
    });
  }
  protected model(model, import_params) {
    const mesh = new RenderMesh();
    mesh.importFromFile(
      MODELSDIR + model + ".obj",
      "obj",
      import_params || null
    );
    return mesh;
  }

  public setHandModel(model_name: string, texture: string, import_params?) {
    const model = ItemModel.getForWithFallback(ItemID[this.id], 0);
    model.setHandModel(
      this.model(model_name, import_params),
      "models/" + texture
    );

  }
  public setItemModel(model_name: string, texture: string, import_params?) {
    const model = ItemModel.getForWithFallback(ItemID[this.id], 0);
    model.setModel(
      this.model(model, import_params),
      "models/" + texture
    );

  }
  public setInventoryModel(
    model_name: string,
    texture: string,
    import_params?: {},
    rotation: [int, int, int] = [0, 0, 0]
  ) {
    const mesh = this.model(model_name, import_params) as RenderMesh;
    mesh.rotate(
     rotation[0],
     rotation[1],
     rotation[2]
    );
   const model = ItemModel.getForWithFallback(ItemID[this.id], 0);
   model.setUiModel(mesh, "models/" + texture);
  };
  public getID(): int {
    return ItemID[this.id];
  }
  public onUse(func: Callback.ItemUseLocalFunction): void {
    Item.registerUseFunction(this.id, func);
  };
  public onUseAndNoTarget(func: (item: ItemInstance, player: int) => void) {
     Item.registerUseFunction(this.id, (coords, item, block, player) => {
      return func(item, player);
     });
     Item.registerNoTargetUseFunction(this.id, func);
  };
  public registerHandFunction(callback: (player: int) => void) {
    handItemFunctions[this.getID()] = callback;
  }
}

Translation.addTranslation("Info is locked", {
  ru: "Закрыто",
});
