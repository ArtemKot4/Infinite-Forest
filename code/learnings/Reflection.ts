class Reflection {
  public learnings: Learning[] = [];
  public static list: Record<name, Set<name>> = {};
  constructor(
    public name: string,
    public message: string,
    public bookPage: string,
    ...learnings: Learning[]
  ) {
    this.learnings = learnings;
  }
  public hasLearnings(player: int) {
    const list = (Learning.list[player] ??= new Set());
    for (const learning of this.learnings) {
      if (learning.has(player) === false) {
        return false;
      };
    }
    return true;
  };
  public has(player: int) {
    return (Reflection.list[Entity.getNameTag(player)] ??= new Set()).has(this.name)
  }
  public send(player: int) {
    if (!this.hasLearnings(player)) return;
    const client = Network.getClientForPlayer(player);
    if (!client) return;
    const name = Entity.getNameTag(player);
    if(this.has(player) === true) return;
    BlockEngine.sendUnlocalizedMessage(
      client,
      Native.Color.DARK_GREEN +
        Translation.translate("message.infinite_forest.reflection")
    );
    Reflection.list[name].add(this.name);
    (BookUI.pagesList[name] ??= ["main_title"]).push(this.bookPage)
  }
}

namespace ReflectionList {
  export const TEMPERATURE_FLOWERS = new Reflection(
    "temperature_flowers",
    "temperature_flowers",
    "temperature_flowers_title",
    LearningList.FIRONIA,
    LearningList.ICE_FLOWER
  );
}

Callback.addCallback("ItemUse", (c, i, b, ise, p) => {
  ReflectionList.TEMPERATURE_FLOWERS.send(p);
});
