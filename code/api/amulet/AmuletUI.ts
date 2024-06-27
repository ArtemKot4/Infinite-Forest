type UIImage =
  com.zhekasmirnov.innercore.api.mod.ui.background.ImageDrawingDescription;

abstract class AmuletUI {
  public static content: UI.WindowContent = {
    drawing: [
      {
        type: "background",
        color: android.graphics.Color.argb(128, 128, 128, 128),
      },
    ],
    elements: {
      close_button: {
        type: "closeButton",
        x: 10,
        y: 10,
        scale: 3,
        bitmap: "close_button",
      },
    },
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
    const element_list = {};
    for (const i in AmuletUI.UI.content.elements) {
      const element = AmuletUI.UI.content.elements[i];
      for (const list of amulet_list) {
        if (element.type === "slot") {
          Game.message("i: " + i + " | list.texture + foreground: " + list.texture + "_foreground");
          if (i === list.texture + "_foreground") {
            element.source = new ItemStack(list.id, 1, 0);
            element.bitmap = "unknown";
            break;
          } else {
            element.source = new ItemStack();
            element.bitmap = "amulet_lock";
          }
        }
      }
      element_list[i] = element;
    }
    return element_list;
  }

  public static openFor(player: int) {
    const container = (AmuletUI.container_list[player] ??= new UI.Container());
    const amulet_list = AmuletUI.detectAmulets(player);
    const content = Object.assign({}, AmuletUI.UI.getContent(), {
      elements: this.redraw(amulet_list, player),
    });
    AmuletUI.UI.setContent(content);
    AmuletUI.UI.forceRefresh();
    container.openAs(AmuletUI.UI);
  }
}

// return AmuletUI.content.drawing.map((v) => {
//   if (v.type !== "bitmap") return v;
//   for (const list of amulet_list) {
//     if (v.bitmap === list.texture) return v;
//   }
//   return Object.assign(v, { bitmap: "amulet_lock" }) satisfies UIImage;
// });
