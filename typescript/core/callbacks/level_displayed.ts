Callback.addCallback("LevelDisplayed", () => {
  Recipes.addShaped(
    { id: BlockID["bottle"], count: 1, data: 0 },
    ["aba", "aca", "aaa"],
    [
      "a",
      VanillaBlockID.glass,
      0,
      "b",
      BlockID["eucalyptus_log"],
      0,
      "c",
      VanillaBlockID.glass_pane,
      0,
    ],
    (api, field, result, player) => {
      if (Math.random() < 0.1) result.id = 0;
      new WorldRegion(BlockSource.getDefaultForActor(player)).playSoundAtEntity(
        player,
        "glass",
        0.4,
        1
      );
      alert("!");
    }
  );
});
