namespace Mill {
  export const MAIN_BLOCK = new FBlock.createWithRotation("mill_main_block", [
    {
      name: "Mill main block",
      texture: [
        ["pink_log", 1],
        ["pink_log", 1],
        ["mill_main_block", 0],
        ["mill_main_block", 0],
        ["mill_main_block", 1],
        ["mill_main_block", 1],
      ],
      inCreative: true,
    },
  ]);


  export const BLADES_STATION = new FBlock("mill_blades_station", [
    {
      name: "Mill blades station",
      texture: [["mill_blades_station", 0]],
      inCreative: true,
    },
  ]);

  export const BLADES = new FBlock.createWithRotation("mill_blades", [
    {
      name: "Mill blades",
      texture: [
        ["unknown", 0],
        ["unknown", 0],
        ["unknown", 0],
        ["unknown", 0],
        ["unknown", 0],
        ["unknown", 0],
      ],
      inCreative: true,
    },
  ]);

  export enum EMillID {
    MAIN_BLOCK = BlockID["mill_main_block"],
    RECEIVER = BlockID["mill_receiver"],
    BLADES = BlockID["mill_blades"],
    BLADES_STATION = BlockID["mill_blades_station"],
  };

  Block.setDestroyLevelForID(EMillID.MAIN_BLOCK, EDestroyLevel.IRON);
  Block.setDestroyLevelForID(EMillID.BLADES_STATION, EDestroyLevel.STONE);
  Block.setDestroyLevelForID(EMillID.RECEIVER, EDestroyLevel.IRON);
  Block.setDestroyLevelForID(EMillID.BLADES, EDestroyLevel.WOOD);

  export function bladesHurt(player) {
    if(Game.getGameMode() === EGameMode.CREATIVE) return;
    Entity.damageEntity(player, 3);
    Game.tipMessage(Native.Color.RED + Translation.translate("It harts!"))
  }; 

  

}
