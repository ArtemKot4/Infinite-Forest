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
    this.drawAll();
    Amulet.list.push({ id: this.ITEM.getID(), name: name, texture: texture });
  }
  public drawButton() {
    const logic = this.logic || null;
    AmuletUI.UI.content.elements[this.name + "_button"] = {
      type: "button",
      scale: 4,
      x: this.slot.x,
      y: this.slot.y,
      bitmap: "amulet_button",
      clicker: {
        onLongClick(position, container, tileEntity, window, canvas, scale) {
          const button = AmuletUI.UI.content.elements[this.name + "_button"];
          if (button.bitmap === "amulet_button") {
            button.bitmap = "amulet_button_pressed";
            AmuletUI.UI.forceRefresh()
            alert("click on");
            if (!!logic) {
              return logic(Player.getLocal());
            }
          } else {
            button.bitmap = "amulet_button";
            AmuletUI.UI.forceRefresh()
            alert("click off");
          }
        },
      },
    };
  }
  public drawForegroundButton() {
    AmuletUI.UI.content.elements[this.texture + "_foreground"] = {
      type: "slot",
      bitmap: "unknown",
      x: this.slot.x * 1.5,
      y: this.slot.y * 0.25,
      scale: 4,
      visual: true
    };
  }
  public drawAll() {
    this.drawButton();
    this.drawForegroundButton();
  }
  public setLogic(logic: (player: int) => void) {
    this.logic = logic;
  }
  public onDetect(logic: (player: int) => void) {
    Amulet.list[Amulet.list.length - 1].detect = logic;
  }
}

namespace Amulets {
  export const FLUFFY = new Amulet("fluffy_amulet", "fluffy_amulet", {
    x: 500,
    y: 20,
  });
  FLUFFY.setLogic((player) => {
    alert(`я нажата!${player}`);
  });
  FLUFFY.onDetect((player) => alert("Найден!"))
}