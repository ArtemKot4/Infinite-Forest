class FItem {
  protected id: string;
  protected stack: int;
  protected meta: int;
  protected isTech: boolean;
  protected texture: string;
  public name: string;
  public static funcs = [];
  constructor(id, stack?, name?, texture?, meta?, isTech?) {
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
      { name: this.texture, meta: this.meta },
      { stack: this.stack, isTech: this.isTech }
    );
  
  
  
})
  
   if(Array.isArray(this.texture) &&
      this.texture.length > 1 ){
        const anim = [];
  this.texture.forEach((item, index, array)=>{
     anim.push(item.replace(this.texture[0].slice(0,-1),""))
};
      IAHelper.makeAdvancedAnim(
        ItemID[this.id],
        this.texture[0].slice(0,-2),
        this.texture.length > 3 ? 
        this.texture.length / 2 : 2,
        anim
      );
  };

  protected info(text: string, translation: {}): void {
    Translation.addTranslation(text, translation);
    Item.registerNameOverrideFunction(this.id, function (item, name) {
      Entity.getSneaking(Player.get()) ?
        name + "\n§7" + Translation.translate(text):
         name + "\n§7" + "Info is locked"
      
    });
  }
  public static onTick(): void {
    for (const i in FItem.funcs) {
      const ind = FItem.funcs[i];
      const item = Entity.getCarriedItem(Player.get()).id;
      (item == ItemID[ind.item] && World.getThreadTime() % 5 == 0) &&
        ind.func();
    }
  }
  public getItemForHand(itemId: string, func: () => void) {
    FItem.funcs.push({ item: itemId, func: func });
  }
}

Translation.addTranslation("Info is locked", {
  ru: "Закрыто",
});
