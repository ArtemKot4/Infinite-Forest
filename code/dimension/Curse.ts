interface IWorldFlagData {
  name: string;
  value: any;
}

abstract class Forest {
  private constructor() {}
  /** World tags for server
   *
   */
  public static flags = {};

  public static setFlag<T>(name: string, value?: T) {
    Forest.flags[name] = value || true;
    // Network.sendToServer("packet.infinite_forest.world_flag_add", {
    //   name,
    //   value,
    // } satisfies IWorldFlagData);
  }

  public static hasFlag(name: string) {
    return !!Forest.flags[name];
  }

  public static getFlag(name: string) {
    return Forest.flags[name];
  }

  public static deleteFlag(name: string) {
     Forest.flags[name] = undefined;
    // Network.sendToServer("packet.infinite_forest.world_flag_delete", { name });
  };

  public static setFlagClient<T>(name: string, value?: T) {
      Network.sendToServer("packet.infinite_forest.Forest.setFlag", {name, value})
  };

  public static deleteFlagClient<T>(name: string) {
    Network.sendToServer("packet.infinite_forest.Forest.deleteFlag", {name})
  }

  static {

    Network.addClientPacket(
      "packet.infinite_forest.Forest.setFlag",
      (data: IWorldFlagData) => {
        Forest.flags[data.name] = data.value || true;
      }
    );

    Network.addClientPacket(
      "packet.infinite_forest.Forest.deleteFlag",
      (data: Pick<IWorldFlagData, 'name'>) => {
        delete Forest.flags[data.name];
      }
    );

  }
}

/** Abstract class to create a forest curses, influencing on player and forest
 *
 */

abstract class Curse {
  /** identifier of your curse
   *
   */

  public static identifier: string = "none";

  /**
   * function that need call in LevelDisplayed Callback
   * @param identifier your Curse.identifier
   */

  @onLevelDisplayed
  public static initialize = (identifier: string) => {
    const flag = (Forest.getFlag("curse") || {}) as {};

    if (!flag[identifier]) {
      return Forest.setFlag(
        "curse",
        Object.assign(flag, {
          [identifier]: true,
        })
      );
    }
    return;
  };

  /**
   * Checks, contain forest your curse or his was broken
   * @returns boolean
   */

  public static worldIs() {
    const flag = Forest.getFlag("curse");
    return flag && !!flag[this.identifier];
  }

  /** Checks, contain forest your curse or his was broken, if player in creative, returns false.
   * Usings if curse have a influence to player for validation
   * @param player player id, optional
   * @returns boolean
   */

  public static allowHas(player?: int) {
    if (player) {
      const actor = new PlayerActor(player);
      if (actor.getGameMode() === EGameMode.CREATIVE) {
        return false;
      }
    }
    return this.worldIs();
  }

  /** Checks, that curses from list has'nt broken. If can a player param, if player in creative, return false;
   * @param list list of names of your curses
   * @param player player id, optional
   */

  public static hasList(list: name[], player?: int) {
    const actor = new PlayerActor(player);

    if (actor.isValid() && actor.getGameMode() === EGameMode.CREATIVE) {
      return false;
    }

    for (let element of list) {
      if (Forest.getFlag("curse")?.[element] === false) {
        return false;
      }
    }

    return true;
  }

  /** Returns name of all curses
   *
   * @returns name of exists curses
   */

  public static getList() {
    return Object.keys(Forest.getFlag("curse"));
  }

  /** Returns list of all curses, name and states
   *
   * @returns Record<name, boolean>
   */

  public static getStatelist() {
    return Forest.getFlag("curse");
  }

  /** Subscribe on your curse
   *
   * @param callback your callback
   * @param player player id, optional
   * @returns your call of callback, if world has a curse.
   * If player param is exists and player in creative, callback can't be called
   */

  public static subscribe(callback: () => void, player?: int) {
    return ((player && this.allowHas(player)) || this.worldIs()) && callback();
  }
}

Saver.addSavesScope(
  "scope.infinite_forest.curseStatelist",
  function read(scope) {
    scope.stateList ??= Curse.getStatelist();
  },
  function save() {
    return { stateList: Curse.getStatelist() };
  }
);

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
  };

  @onTick
  public static onInventory(player: int) {

    return ColdCurse.subscribe(() => {
       ForestUtils.randomizeHotbarSlot(player);
       Entity.damageEntity(player, 3);
       return;
     }, player)
       
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

Translation.addTranslation("message.infinite_forest.cold_myself", {
  ru: "Становится холодно...",
  en: "Cold is coming...",
});
