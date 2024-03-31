namespace Mill {

  export const MAIN_BLOCK = new FBlock.createWithRotation("mill_main_block", [
    {
      name: "Mill main block",
      texture: [
        ["mill_main_block", 0],
        ["mill_main_block", 0],
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

  export const EUCALYPTUS_BLADES = new FBlock.createWithRotation("eucalyptus_mill_blades", [
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
    EUCALYPTUS_BLADES = BlockID["eucalyptus_mill_blades"],
    PINK_BLADES = BlockID["pink_mill_blades"],
    BLADES_STATION = BlockID["mill_blades_station"],
  };

  Block.setDestroyLevelForID(EMillID.MAIN_BLOCK, EDestroyLevel.IRON);
  Block.setDestroyLevelForID(EMillID.BLADES_STATION, EDestroyLevel.STONE);
  Block.setDestroyLevelForID(EMillID.RECEIVER, EDestroyLevel.IRON);
  Block.setDestroyLevelForID(EMillID.EUCALYPTUS_BLADES, EDestroyLevel.WOOD);

  export function bladesHurt(player, height) {
    if(Game.getGameMode() === EGameMode.CREATIVE) return;
    const color_validation = height < 20 ? Native.Color.GREEN : height < 35 ? Native.Color.RED : Native.Color.DARK_RED;
    Entity.damageEntity(player, height / 2.7);
    Game.tipMessage(color_validation + Translation.translate("It harts!"))
  }; 

  

}
