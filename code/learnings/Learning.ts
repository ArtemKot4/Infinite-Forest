type playerName = name;

class Learning {
  public static list: Record<playerName, Set<name>> = {};
  constructor(public name: string, public message: string = name) {}
  public send(player: int, color: Native.Color = Native.Color.GREEN) {
    if (this.has(player) === true) return;
    const client = Network.getClientForPlayer(player);
    if (!client) return;
    const name = Entity.getNameTag(player);
    BlockEngine.sendUnlocalizedMessage(
      client,
      `<${name}> ${color}${Translation.translate(
        "learning.infinite_forest." + this.message
      )}`
    );
    Learning.list[name].add(this.name);
  }

  public has(player: int) {
    return (Learning.list[Entity.getNameTag(player)] ??= new Set()).has(this.name);
  }

  public static clickerList: { block: Tile; learning: Learning }[] = [];

  public static sendByClick(block: Tile, learning: Learning) {
    Learning.clickerList.push({ block, learning });
  }

  static {
    Callback.addCallback(
      "ItemUse",
      (coords, item, clickerBlock, isExternal, player) => {
        for (const i in this.clickerList) {
          const block = this.clickerList[i].block;
          if (
            block.id === clickerBlock.id &&
            block.data === clickerBlock.data
          ) {
            this.clickerList[i].learning.send(player);
          }
        }
      }
    );
  }
}

Callback.addCallback("LevelDisplayed", () => {
  const name = Entity.getNameTag(Player.getLocal());
  Learning.list[name] ??= new Set();
});

namespace LearningList {
  export const FIRE_UNLIT = new Learning("fire_unlit");
  export const FIRONIA = new Learning("fironia");
  export const ICE_FLOWER = new Learning("ice_flower");
  export const ELECTRIC_MUSHROOM = new Learning("electric_mushroom")
}

Learning.sendByClick({ id: BlockID["fironia"], data: 0 }, LearningList.FIRONIA);
Learning.sendByClick({ id: BlockID["ice_flower"], data: 0 }, LearningList.ICE_FLOWER);

Learning.sendByClick({id: BlockID["electric_mushroom"], data: 0}, LearningList.ELECTRIC_MUSHROOM);