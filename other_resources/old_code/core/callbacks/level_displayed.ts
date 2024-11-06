Callback.addCallback("LevelDisplayed", () => {
  for(let i = 0; i <= 15; i++) {
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
      i,
    ]
  );
  }
});
