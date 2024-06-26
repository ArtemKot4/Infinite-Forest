interface IAmuletUIPosition {
  x: int;
  y: int;
}

type amulet_list = {
  id: int;
  name: string;
  texture: string;
  detect?: (player: int) => void;
};
class Amulet {
  public logic: (player) => void;
  public static list: amulet_list[] = [];
  public ITEM: FItem;
  constructor(
    public name: string,
    public texture: string,
    public slot: IAmuletUIPosition
  ) {
    this.ITEM = new FItem(
      name,
      1,
      "item.infinite_forest.amulet." + name,
      texture,
      0
    );
    this.drawUIElement();
    Amulet.list.push({ id: this.ITEM.getID(), name: name, texture: texture });
  }
  public drawButton() {
    AmuletUI.UI.content.elements[this.name + "_button"] = {
      type: "button",
      scale: 4,
      x: this.slot.x,
      y: this.slot.y,
      bitmap: "amulet_button",
      clicker: {
        onClick(position, container, tileEntity, window, canvas, scale) {
          const button = AmuletUI.UI.content.elements[this.name + "_button"];
          button.bitmap = button.bitmap === "amulet_button" ?
            "amulet_button_pressed" : "amulet_button";
        },
      },
    };
  }
  public drawUIElement() {
    this.drawButton();
    AmuletUI.UI.content.drawing.push({
      type: "bitmap",
      x: this.slot.x * 0.5,
      y: this.slot.y - this.slot.y * 0.25,
      scale: 2.5,
      bitmap: this.texture,
    });
  }
  public setLogic(logic: (player: int) => void) {
    AmuletUI.UI.content.elements[this.name + "_button"].clicker.onClick =
      function (position, container, tileEntity, window, canvas, scale) {
        const button = AmuletUI.UI.content.elements[this.name + "_button"];
       button.bitmap = button.bitmap === "amulet_button" ?
            "amulet_button_pressed" : "amulet_button";
        return logic(Player.getLocal());
      };
  }
  public onDetect(logic: (player: int) => void) {
    Amulet.list[Amulet.list.length - 1].detect = logic;
  }
}

namespace Amulets {
  export const FLUFFY = new Amulet("fluffy_amulet", "fluffy_amulet", {
    x: 100,
    y: 20,
  });
  FLUFFY.setLogic((player) => {
    alert(`я нажата!${player}`);
  })
}
