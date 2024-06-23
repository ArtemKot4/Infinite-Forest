abstract class Curse {
  private static curse_list: string[] = [];
  public readonly player_list: int[] = [];
  public onTick(player): void {
    if (this.player_list.includes(player)) return;
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
        color: android.graphics.Color.argb(0, 0, 0, 0)
      },
      {
        type: "bitmap",
        x: -5,
        y: -22.5,
        bitmap: "screen_cold",
        scale: 3.6
      },
    ],
  });
  public onTick(player): void {
    if (this.player_list.includes(player)) return;
    const pos = Entity.getPosition(player);
    if (pos.y > 185) {
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
      ColdCurse.UI.isOpened() && ColdCurse.UI.close();
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
