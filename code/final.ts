Callback.addCallback("LevelDisplayed", () => {
  
  ColdCurse.initialize(ColdCurse.identifier);
  DungeonCurse.initialize(DungeonCurse.idenitifier);
  CursedLightning.initialize(CursedLightning.identifier);

  CandleTileReplacer.initCandles();

  ServerPlayer.initialize();

  Book.MainUI.initializeSections();

  Game.message("curse flag: -> " + JSON.stringify(Forest.getFlag("curse")));
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
