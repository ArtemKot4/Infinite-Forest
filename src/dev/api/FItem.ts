
class FItem {
  protected id: string;
  protected stack: int;
  protected meta: int;
  protected isTech: boolean;
  protected texture: string;
  public name: string
  public funcs = [];
  constructor(id, stack?, name?, texture?, meta?, isTech?) {
    this.id = id;
    this.stack = stack || 64;
    this.meta = meta || 0;
    this.isTech = isTech || false;
    this.texture = texture || id;
    this.name = name || this.id[0].toUpperCase() + this.id.slice(1).replace(/_/g, " ").toString();
    this.create();
  }
  
   public category(int: int): void {
    Item.setCategory(this.id, int)
   };

  public create(): void {
    IDRegistry.genItemID(this.id);
    Item.createItem(
      this.id,
      this.name,
      { name: this.texture, meta: this.meta },
      { stack: this.stack, isTech: this.isTech }
    );
  
  }
  
 public toAnimate(indexes: number[], time: number){
   time = time || 2;
   IAHelper.makeAdvancedAnim(
   ItemID[this.id],
   this.id,
   time,
   indexes
 );
 }
  protected info(text, translation): void {
    Translation.addTranslation(text, translation);
    Item.registerNameOverrideFunction(this.id, function (item, name) {
      if (Entity.getSneaking(Player.get())) {
        return name + "\n§7" + Translation.translate(text);
      } else {
        return (
          name +
          "\n§7" +
          Translation.translate("You ready to know?")
        );
      }
    });
  }
 public static onTick() {
   for(const i in FItem.funcs){
     const ind = FItem.funcs[i];
     const item = Entity.getCarriedItem(Player
 get()).id;
   if(item == ItemID[ind.item] && World.getThreadTime()%5==0){
     ind.func();
   };
     
   }
 };
 public ifCarried(itemId: string, func: () => void){
 
   FItem.funcs.push({item: itemId, func: func})
 }
}

Translation.addTranslation("You ready to know?", {
  ru: "Ты уверен что хочешь узнать?"
});