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

class AmuletButton {
  public backgroundButton: Nullable<UIImage>;
  public logicActive: (player) => void;
  public logicDeactive: (player) => void;
  constructor(public amulet: Amulet, public slot: IAmuletUIPosition) {
    this.drawAll();
  };
  public onClick(
    position: Vector,
    container: com.zhekasmirnov.innercore.api.mod.ui.container.UiAbstractContainer
  ) {
    alert("!");
    if (!this.backgroundButton) return;
    if (this.backgroundButton.bitmap === "amulet_button") {
      this.logicActive(Player.getLocal());
      this.backgroundButton.bitmap = "amulet_button_pressed";
    } else {
      this.logicDeactive(Player.getLocal());
      this.backgroundButton.bitmap = "amulet_button";
    }
    AmuletUI.UI.forceRefresh();
    return;
  }
  public drawBackgroundButton() {
    AmuletUI.UI.content.drawing.push({
      type: "bitmap",
      scale: 4,
      x: this.slot.x,
      y: this.slot.y,
      bitmap: "amulet_button",
    });
    this.backgroundButton =
      (AmuletUI.UI.content.drawing.find(
        (v) => v.type === "bitmap" && v.x === this.slot.x && v.y === this.slot.y
      ) as UIImage) || null;
  }
  public drawForegroundButton() {
    const self = this;
    AmuletUI.UI.content.elements[this.amulet.texture + "_foreground"] = {
      type: "slot",
      bitmap: "unknown",
      x: this.slot.x * 1.05,
      y: this.slot.y * 0.25,
      scale: 4,
      visual: true,
      clicker: {
        onClick: this.onClick.bind(self),
      },
    };
  }
  public drawAll() {
    this.drawBackgroundButton();
    this.drawForegroundButton();
  }
  public setLogicActive(logic: (player: int) => void) {
    this.logicActive = logic;
    return this;
  }
  public setLogicDeactive(logic: (player: int) => void) {
    this.logicActive = logic;
    return this;
  };
}
