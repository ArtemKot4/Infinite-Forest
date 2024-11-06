interface IReflection {
  message: string;
  bookPage: string;
  learnings: string[];
  sign: string | string[];
}

class Reflection {
  public static list: Record<name, IReflection> = {};

  
  constructor(
    public name: string,
    public message: string,
    public bookPage: string,

    sign?: string | string[],
    ...learnings: string[]
  ) {
    Reflection.list[name] = { message, bookPage, learnings, sign };
  }

  public static hasLearnings(player: int, learnings: string[]) {

    for (const learning of learnings) {
      if (Learning.has(player, learning) === false) {
        return false;
      }
    }

    return true;
  }

  public static has(player: int, name: string) {
    let current: Nullable<Set<string>> = ServerPlayer.getFlag(player, "reflections");

    if(!current) {
      ServerPlayer.setFlag(player, name, new Set());
      current = ServerPlayer.getFlag(player, "reflections");
    };

   return current.has(name);
    
  }

  public static send(
    player: int,
    name: string,
    section: keyof Book.ISectionList = "default"
  ) {
    if (Reflection.has(player, name)) return;

    if (!Reflection.hasLearnings(player, Reflection.list[name].learnings)) {
      return;
    }

    Reflection.sendMessage(player);

    const list = ServerPlayer.getFlag(player, "reflections");

    list.add(name);

    Book.Section.givePage(
      player,
      Reflection.list[name].bookPage,
      section,
      Reflection.list[name].sign || null
    );
  }
  public static sendMessage(player: int) {
    return ForestUtils.sendMessageFromName(
      player,
      `${Native.Color.DARK_GREEN}${Translation.translate(
        "message.infinite_forest.reflection"
      )}`
    );
  }
}

namespace ReflectionList {
  export const TEMPERATURE_FLOWERS = new Reflection(
    "temperature_flowers",
    "temperature_flowers",
    "temperature_flowers_title",
    ["snow", "fire"],
    "fironia",
    "ice_flower"
  );
}

Callback.addCallback("ItemUse", (c, i, b, ise, p) => {
  Reflection.send(p, "temperature_flowers");
});
