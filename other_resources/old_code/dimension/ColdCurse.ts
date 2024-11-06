abstract class ColdCurse extends Curse {
    public static COLD_HEIGHT = 130;
    public static COLD_MESSAGE: boolean = true;
    public static identifier: string = "cold";
  
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
  
    public static open() {
      ColdCurse.UI.open();
  
      let alpha = 0;
  
      ColdCurse.UI.layout.setAlpha(alpha);
  
      Threading.initThread("thread.infinite_forest.cold_curse_ui", () => {
        while (alpha < 1) {
          alpha += 0.005;
          ColdCurse.UI.layout.setAlpha(alpha);
          java.lang.Thread.sleep(5);
        }
      });
    }
  
    public static close() {
      ColdCurse.UI.open();
  
      let alpha = 1;
  
      ColdCurse.UI.layout.setAlpha(alpha);
  
      Threading.initThread("thread.infinite_forest.cold_curse_ui", () => {
        while (alpha > 0) {
          alpha -= 0.005;
          ColdCurse.UI.layout.setAlpha(alpha);
  
          if (alpha >= 1) {
            ColdCurse.UI.close;
          }
  
          java.lang.Thread.sleep(5);
        }
      });
    }
  
    public static runSnow(x: int, y: int, z: int, radius = 16, count = 16) {
      if (World.getThreadTime() % 8 === 0) {
        for (let n = -count; n <= count; n++) {
          ParticlePacket.send(
            EForestParticle.SNOWFALL,
            x + n,
            y,
            z + randomInt(-radius, radius),
            0.05,
            -0.1,
            0,
            Player.getLocal()
          );
  
          ParticlePacket.send(
            EForestParticle.SNOWFALL,
            x + randomInt(-radius, radius),
            y,
            z + n,
            0.05,
            -0.1,
            0,
            Player.getLocal()
          );
        }
      }
    }
  
    public static sendMessage(coords: Vector) {
      if (coords.y >= 115) {
        ColdCurse.COLD_MESSAGE === true &&
          ForestUtils.sendMessageFromName(
            Player.getLocal(),
            `${Native.Color.BLUE}${Translation.translate(
              "message.infinite_forest.cold_myself"
            )}`
          );
  
        ColdCurse.COLD_MESSAGE = false;
      } else {
        ColdCurse.COLD_MESSAGE = true;
      }
    }
  
    public static damage(player: int) {
      Entity.damageEntity(player, 1);
      Entity.addEffect(player, EPotionEffect.DIG_SLOWDOWN, 3, 10, false, false);
      return;
    }
  
    @onTick
    public static onInventory(player: int) {
      return ColdCurse.subscribe(() => {
        ForestUtils.randomizeHotbarSlot(player);
        Entity.damageEntity(player, 3);
        return;
      }, player);
    }
  
    // public static onTick(ticker: int, player: int): void {
    //   if (this.has(player) === false) return;
    //   const pos = Entity.getPosition(player);
    //   if (pos.y > ColdCurse.COLD_HEIGHT) {
    //     ServerPlayerDamage();
    //     if (ColdCurse.UI.isOpened() === false) {
    //       ColdCurse.UI.open();
    //     }
    //   } else {
    //     ColdCurse.UI.isOpened() && ColdCurse.UI.close();
    //   }
    // }
    static {
      ColdCurse.UI.setTouchable(false);
      ColdCurse.UI.setAsGameOverlay(true);
    }
  }