abstract class Curse {
  private static curse_list: string[] = [];
  public readonly player_list: int[] = [];
  public onTick(...args): void {
    if (this.player_list.includes(args[0])) return;
  }
  public name: string;
  constructor() {
    Curse.curse_list.push(this.name);
  }
}

class ColdCurse extends Curse {
  public static UI = new UI.Window({
    drawing: [
      {
        type: "background",
        color: android.graphics.Color.argb(0, 0, 0, 0),
      },
      {
        type: "bitmap",
        x: -5,
        y: -22.5,
        bitmap: "screen_cold",
        scale: 3.6,
      },
    ],
  });
  public onTick(ticker: int, player: int): void {
    if (this.player_list.includes(player)) return;
    const pos = Entity.getPosition(player);
    if (pos.y > 185) {
      if (ColdCurse.UI.isOpened() && ticker > 2) {
        ticker--;
        ColdCurse.UI.layout.setAlpha(1 / ticker);
        ColdCurse.UI.forceRefresh()
      }
      if (new PlayerActor(player).getGameMode() !== EGameMode.CREATIVE) {
        Entity.damageEntity(player, 5);
        Entity.addEffect(
          player,
          EPotionEffect.DIG_SLOWDOWN,
          3,
          10,
          false,
          false
        );
      }
      ColdCurse.UI.isOpened() === false && ColdCurse.UI.open();
    } else {
      const isOpened = ColdCurse.UI.isOpened() === true;
      isOpened && ColdCurse.UI.layout.setAlpha(1);
      ColdCurse.UI.forceRefresh()
      isOpened && ColdCurse.UI.close();
      ticker = 1000;
    }
  }
  static {
    ColdCurse.UI.setTouchable(false);
    ColdCurse.UI.setAsGameOverlay(true);
  }
}

namespace Curses {
  export const COLD = new ColdCurse();
}
