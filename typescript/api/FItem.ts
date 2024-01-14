class FItem {
  protected id: string;
  protected stack: int;
  protected meta: int;
  protected isTech: boolean;
  protected texture: string | [string, int, int?];
  protected name: string;
  public static funcs = [];
  constructor(id: string, stack?: int, name?: string, texture?: string | [texture: string, frame: int, time?: int] , meta?: int, isTech?: boolean) {
    this.id = id;
    this.stack = stack || 64;
    this.meta = meta || 0;
    this.isTech = isTech || false;
    this.texture = texture || id;
    this.name = name || id;
    this.create();
  }

  public category(int: int): void {
    Item.setCategory(this.id, int);
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
  }
  public info(text: string, translation: {}): void {
    Translation.addTranslation(text, translation);
    Item.registerNameOverrideFunction(this.id, function (item, name) {
      Entity.getSneaking(Player.get())
        ? name + "\n§7" + Translation.translate(text)
        : name + "\n§7" + "Info is locked";
    });
  }
  public static onTick(): void {
    for (const i in FItem.funcs) {
      const ind = FItem.funcs[i];
      const item = Entity.getCarriedItem(Player.get()).id;
      item == ItemID[ind.item] && World.getThreadTime() % 5 == 0 && ind.func();
    }
  }
  public getItemForHand(func: () => void) {
    FItem.funcs.push({ item: this.id, func: func });
  }
  public onUse(func: (coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile) => void): void {
    Item.registerUseFunction(this.id, (coords, item, block) => {
      func(coords, item, block);
    });
  }
}

Translation.addTranslation("Info is locked", {
  ru: "Закрыто",
});
