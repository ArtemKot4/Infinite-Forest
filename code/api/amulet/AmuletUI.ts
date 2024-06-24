abstract class AmuletUI {
  public static content: UI.WindowContent = {
    drawing: [
      {
        type: "background",
        color: android.graphics.Color.argb(0.3, 56 / 256, 65 / 256, 56 / 256)
      }
    ],
    elements: {
      
    }
  }
  public static UI: UI.Window;

  static {
    AmuletUI.UI = new UI.Window(AmuletUI.content as UI.WindowContent);
  };

  public static detectAmulets(player: int) {
    const actor = new PlayerActor(player);
    for(let i = 0; i <= 35; i++) {
    const slot = actor.getInventorySlot(i);
    //TODO: continue
    }
  }
  public static redraw(player: int) {

  }
};

