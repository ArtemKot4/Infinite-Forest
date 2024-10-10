Callback.addCallback("LevelDisplayed", () => {
  const players = Network.getConnectedPlayers();
  for (const i in players) {
    const name = Entity.getNameTag(players[i]);
    Book.GraphicUI.initializeSections(name);
    Game.message(JSON.stringify(Book.GraphicUI.pagesList[name]));
  }
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
