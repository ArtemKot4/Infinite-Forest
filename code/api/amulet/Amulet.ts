class Amulet {
  public static list: amulet_list[] = [];
  public ITEM: FItem;
  public button: AmuletButton;
  constructor(public name: string, public texture: string) {
    this.ITEM = new FItem(
      name,
      1,
      "item.infinite_forest.amulet." + name,
      texture,
      0
    );
    Amulet.list.push({ id: this.ITEM.getID(), name: name, texture: texture});
  };
  public onDetect(logic: (player: int) => void) {
    Amulet.list[Amulet.list.length - 1].detect = logic;
    return this;
  };
  public setupButton(x: int, y: int) {
    return new AmuletButton(this, {x, y});
  }
}

namespace Amulets {
  export const FLUFFY = new Amulet("fluffy_amulet", "fluffy_amulet")
    .setupButton(500, 20)
    .setLogicActive((player) => {
      alert(`я включилась!${player}`);
    })
    .setLogicDeactive((player) => {
      alert("Я выключилась!");
    })
}
