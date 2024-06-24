interface IAmuletUIPosition {
    x: int,
    y: int,
};

class Amulet {
    public static list: Record<string, int>[] = []
  public ITEM: FItem;
  constructor(public name: string, public texture: string, public slot: IAmuletUIPosition) {
    this.ITEM = new FItem(
      name,
      1,
      "item.infinite_forest.amulet." + name,
      texture,
      0
    );
    this.drawUIElement();
    Amulet.list.push({[name]: this.ITEM.getID()});
  };
  public drawUIElement() {
    AmuletUI.UI.content.elements[this.name + "_button"] = {
        type: "button",
        scale: 2,
        x: this.slot.x,
        y: this.slot.y,
        bitmap: "amulet_button",
        bitmap2: "amulet_button_pressed"
    };
    AmuletUI.UI.content.drawing.push({
        type: "bitmap",
        x: this.slot.x * 1.5,
        y: this.slot.y * 0.5,
        bitmap: this.texture
    })
  }
}
