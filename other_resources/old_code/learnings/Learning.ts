type playerName = string;
type message = string;

class Learning {
  public static list: Record<name, message> = {};

  constructor(public name: string, public message: string = name) {
    Learning.list[name] = message;
  }

  public static sendMessage(name: string, player: int, color: Native.Color) {
    return ForestUtils.sendMessageFromName(
      player,
      `${color}${Translation.translate(
        "learning.infinite_forest." + Learning.list[name]
      )}`
    );
  }

  public static send(
    name: string,
    player: int,
    color: Native.Color = Native.Color.DARK_GREEN,
    page?: name,
    sign: string | string[] = null,
    section: keyof Book.ISectionList = "default"
  ) {
    if (Learning.has(player, name)) return;

    Learning.sendMessage(name, player, color);

    const list: Set<string> = ServerPlayer.getFlag(player, "learnings");

    list.add(name);

    if (page) {
      Book.Section.givePage(player, page, section, sign);
      Reflection.sendMessage(player);
    }
  };


  public static has(player: int, name: string) {
    let current: Nullable<Set<string>> = ServerPlayer.getFlag(player, "learnings");

    if(!current) {
      ServerPlayer.setFlag(player, name, new Set());
      current = ServerPlayer.getFlag(player, "learnings");
    };

   return current.has(name);
    
  }

  public static clickerList: { block: Tile; name: name }[] = [];

  public static sendByClick(block: Tile, name: name) {
    Learning.clickerList.push({ block, name });
  }

  static {
    Callback.addCallback(
      "ItemUse",
      (coords, item, clickerBlock, isExternal, player) => {
        for (const i in Learning.clickerList) {
          const block = Learning.clickerList[i].block;
          if (
            block.id === clickerBlock.id &&
            block.data === clickerBlock.data
          ) {
            Learning.send(Learning.clickerList[i].name, player);
          }
        }
      }
    );
  }
}

// Callback.addCallback("LevelDisplayed", () => {
//   const name = Entity.getNameTag(Player.getLocal());
//   Learning.playerList[name] ??= new Set();
// });

namespace LearningList {
  export const FIRE_UNLIT = new Learning("fire_unlit");
  export const FIRONIA = new Learning("fironia");
  export const ICE_FLOWER = new Learning("ice_flower");
  export const FOREST_IS_REAL = new Learning("infinite_forest_is_real");
  export const RUINE = new Learning("ruine");
  export const SIGN = new Learning("sign");
}

Learning.sendByClick({ id: BlockID["fironia"], data: 0 }, "fironia");
Learning.sendByClick({ id: BlockID["ice_flower"], data: 0 }, "ice_flower");

Learning.sendByClick(
  { id: BlockID["electric_mushroom"], data: 0 },
  "electric_mushroom"
);
