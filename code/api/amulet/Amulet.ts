interface IAmuletUIPosition {
    x: int,
    y: int,
};

type amulet_list = {id: int, name: string, texture: string, logic?: (player: int) => void, detect?: (player: int) => void}
class Amulet {
    public static list: amulet_list[] = []
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
    Amulet.list.push({id: this.ITEM.getID(), name: name, texture: texture});
  };
  public drawUIElement() {
    AmuletUI.UI.content.elements[this.name + "_button"] = {
        type: "button",
        scale: 1.5,
        x: this.slot.x,
        y: this.slot.y,
        bitmap: "amulet_button",
        bitmap2: "amulet_button_pressed"
    };
    AmuletUI.UI.content.drawing.push({
        type: "bitmap",
        x: this.slot.x * 1.5,
        y: this.slot.y * 0.5,
        scale: 2,
        bitmap: this.texture
    })
  };
  public setLogic(logic: (player: int) => void) {
    Amulet.list[Amulet.list.length - 1].logic = logic;
  };
  public onDetect(logic: (player: int) => void) {
    Amulet.list[Amulet.list.length - 1].detect = logic;
  }
}

namespace Amulets {
  export const FLUFFY = new Amulet("fluffy_amulet", "fluffy_amulet", {
  x: 100,
  y: 20,  
  })
}