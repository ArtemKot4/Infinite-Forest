Callback.addCallback("LevelDisplayed", () => {
      Recipes.addShaped(
  { id: BlockID.pink_planks, count: 4, data: 2 },
  ["lll", "lll", "lll"],
  ["l", BlockID.pink_log, -1]
);
Recipes.addShaped(
  { id: BlockID.eucalyptus_planks, count: 4, data: 2 },
  ["lll", "lll", "lll"],
  ["l", BlockID.eucalyptus_log, -1]
  
);

Recipes.addShaped(
  { id: VanillaBlockID.chest, count: 4, data: 0 },
  ["lll", "lll", "lll"],
  ["l", BlockID.eucalyptus_log, 0]
);

Recipes.addShaped(
  { id: VanillaBlockID.chest, count: 4, data: 0 },
  ["bbb", "b b", "bbb"],
  ["b", BlockID.pink_log, 0]
);

Recipes.addShaped(
  { id: VanillaBlockID.chest, count: 4, data: 0 },
  ["bbb", "b b", "bbb"],
  ["b", BlockID.pink_planks, 0]
);

Recipes.addShaped(
  { id: VanillaBlockID.chest, count: 4, data: 0 },
  ["bbb", "b b", "bbb"],
  ["b", BlockID.eucalyptus_planks, 0]
);


})