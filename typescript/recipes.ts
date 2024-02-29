Callback.addCallback("LevelDisplayed", () => {
    Recipes.addShaped(
        { id: ItemID.blueCrystal, count: 1, data: 0 },
        ["ldl", "lsl", "ddd"],
        ["d", 264, -1, "d", 3, -1, "l", 18, -1, "s", 6, -1]
      );
      
      Recipes.addShaped(
  { id: BlockID.pink_planks, count: 4, data: 2 },
  ["vvv", "vlv", "vvv"],
  ["l", BlockID.pink_log, -1]
);
Recipes.addShaped(
  { id: BlockID.eucalyptus_planks, count: 4, data: 2 },
  ["vvv", "vlv", "vvv"],
  ["l", BlockID.eucalyptus_log, -1]
  
);

Recipes.addShaped(
  { id: VanillaBlockID.chest, count: 4, data: 0 },
  ["bbb", "b b", "bbb"],
  ["b", BlockID.eucalyptus_log, 0]
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