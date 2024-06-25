type UIImage =
  com.zhekasmirnov.innercore.api.mod.ui.background.ImageDrawingDescription;

abstract class AmuletUI {
  public static content: UI.WindowContent = {
    drawing: [
      {
        type: "background",
        color: android.graphics.Color.argb(128, 128, 128, 128)
      },
    ],
    elements: {},
  };

  public static UI = new UI.Window(AmuletUI.content as UI.WindowContent);
  public static container_list: Record<int, UI.Container> = {};

  public static detectAmulets(player: int): amulet_list[] {
    const list = [];
    const actor = new PlayerActor(player);
    for (let i = 0; i <= 35; i++) {
      const slot = actor.getInventorySlot(i);
      for (let amulet of Amulet.list) {
        if (slot.id === amulet.id) {
          list.push(amulet);
        }
      }
    }
    return list;
  }

  public static redraw(amulet_list: amulet_list[], player: int) {
    return AmuletUI.content.drawing.map((v) => {
      if (v.type !== "bitmap") return v;
      for (const list of amulet_list) {
        if (v.bitmap === list.texture) return v;
      }
      return Object.assign(v, { bitmap: "amulet_lock" }) satisfies UIImage;
    });
  }

  public static openFor(player: int) {
    const container = (AmuletUI.container_list[player] ??= new UI.Container());
    const amulet_list = AmuletUI.detectAmulets(player);
    if (amulet_list.length !== 0) {
      const content = Object.assign({}, AmuletUI.content, {
        drawing: AmuletUI.redraw(amulet_list, player),
      });
      AmuletUI.UI.setContent(content);
    } else {
      const drawing = AmuletUI.content.drawing.map((v) => {
        if (v.type === "bitmap") {
          return Object.assign(v, { bitmap: "amulet_lock" });
        }
        return v;
      });
      AmuletUI.UI.setContent(
        Object.assign({}, AmuletUI.content, { drawing: drawing })
      );
    }

    container.openAs(AmuletUI.UI);
  }
}