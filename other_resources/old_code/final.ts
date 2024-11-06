Callback.addCallback("LevelDisplayed", () => {

  const player = Player.getLocal();
  const defaultSection = ServerPlayer.getFlagFromServer(player, "pages", {"default": {"main": {directions: null}}});

  ServerPlayer.setFlagFromClient(player, "pages", Object.assign(defaultSection))

  
  ColdCurse.initialize(ColdCurse.identifier);
  DungeonCurse.initialize(DungeonCurse.idenitifier);
  CursedLightning.initialize(CursedLightning.identifier);

  CandleTileReplacer.initCandles();

  ServerPlayer.initialize();
 

  Book.MainUI.initializeSections();

  Game.message("curse flag: -> " + JSON.stringify(Forest.getFlag("curse")));
  Game.message(JSON.stringify( ServerPlayer.getFlagFromServer(player, "pages", "нет такого флага как pages у player")))
});

Translation.addTranslation("group.infinite_forest.lightning", {
  en: "Lightning",
  ru: "Освещение",
});

Item.addToCreative(ELightCandles.none.getID(), 1, 0);
Item.addToCreative(FULL_BOTTLE.getID(), 1, 0);
Item.addToCreative(EMPTY_BOTTLE.getID(), 1, 0);

Item.addCreativeGroup(
  "group.infinite_forest.lightning",
  Translation.translate("lightning"),
  [ELightCandles.none.getID(), FULL_BOTTLE.getID(), EMPTY_BOTTLE.getID()]
);

ModAPI.registerAPI("InfiniteForest", {
  Curse,
  ColdCurse,
  Book,
  ForestUtils,
  Forest,
  ForestBiomes,
  ForestCommand,
  ForestGeneration,
  ForestStructurePool,
  InfiniteForest,
  ParticlePacket,
  fireParticle,
  LazerParticlePacket,
  EForestParticle,
  placeFirefliesBottle,
  destroyBottle,
  destroyBottleByRandom,
  FULL_BOTTLE,
  FirefliesBottle,
  EMPTY_BOTTLE,
  BLOCK_TYPE_TRANSLURENT,
  Learning,
  LearningBook,
  LearningList,
  Reflection,
  ReflectionList,
  DungeonBlock,
  DungeonBlockList,
  DungeonBlocks,
  DungeonCurse,
  DungeonDoor,
  DungeonDoorList,
  DungeonKey,
  DungeonKeyList,
  IceDungeonBlock,
  IceBlock,
  Wood,
  TransferCrystal,
  TransferStorage,
  Cauldron,
  Plants,
  BLOCK_TYPE_PLANT,
  Candle,
  CandleTileReplacer,
  Amulet,
  AmuletBag,
  AmuletButton,
  AmuletUI,
  FItem,
  FBlock,
  MagicFlame,
  MagicFlameBlock,
  MagicTile,
  Tag,
  Tags,
  Archaeology,
  LostPaper,
  LOST_PAPER,
  requireGlobal(command) {
  return eval(command);
 }} )