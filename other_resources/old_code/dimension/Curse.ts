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

  public static getFlag<T>(name: string, fallback?: T) {
    return Forest.flags[name] || fallback;
  }

  public static deleteFlag(name: string) {
    delete Forest.flags[name];
    // Network.sendToServer("packet.infinite_forest.world_flag_delete", { name });
  }

  public static getFlagFromServer<T>(player: int, name: string, fallback?: T) {
    
    Network.getClientForPlayer(player).send(
      "packet.infinite_forest.Forest.getFlag",
      { name });

    return this.getFlag(name, fallback);
    
  }

  public static setFlagClient<T>(name: string, value?: T) {
    Network.sendToServer("packet.infinite_forest.Forest.setFlag", {
      name,
      value,
    });
  }

  public static deleteFlagClient<T>(name: string) {
    Network.sendToServer("packet.infinite_forest.Forest.deleteFlag", { name });
  }

  static {
    Network.addClientPacket(
      "packet.infinite_forest.Forest.setFlag",
      (data: IWorldFlagData) => {
        Forest.flags[data.name] = data.value || true;
      }
    );

    Network.addServerPacket(
      "packet.infinite_forest.Forest.getFlag",
      (client: NetworkClient, data: IWorldFlagData) => {
        client.send("packet.infinite_forest.Forest.setFlag", {
          name: data.name,
          value: Forest.getFlag(data.name),
        });
      }
    );

    Network.addClientPacket(
      "packet.infinite_forest.Forest.deleteFlag",
      (data: Pick<IWorldFlagData, "name">) => {
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
  };

  public static break<T extends Side>(side: T, player: T extends Side.Server ? Nullable<int> : int) {
    let flag = null;

        if(side === Side.Client) {

           flag = Forest.getFlagFromServer(player, "curse", {});

          Forest.setFlagClient("curse", Object.assign(flag, {[this.identifier]: false}))

        } else {

           flag = Forest.getFlag("curse", {});

          Forest.setFlag("curse", Object.assign(flag, {[this.identifier]: false}));

        }
        Callback.invokeCallback("onCurseBreaked", this.identifier)
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



Translation.addTranslation("message.infinite_forest.cold_myself", {
  ru: "Становится холодно...",
  en: "Cold is coming...",
});
