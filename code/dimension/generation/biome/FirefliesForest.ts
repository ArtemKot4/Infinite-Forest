namespace ForestGeneration {
  addPlant(0.2, EForestPlants.FIRONIA, 0, 3, ForestBiomes.FirefliesForest);
  addPlant(
    0.3,
    VanillaBlockID.red_mushroom,
    0,
    3,
    ForestBiomes.FirefliesForest
  );
  addPlant(
    0.2,
    VanillaBlockID.brown_mushroom,
    0,
    3,
    ForestBiomes.FirefliesForest
  );
  addPlant(
    0.1,
    EForestPlants.ELECTRIC_MUSHROOM,
    0,
    5,
    ForestBiomes.FirefliesForest
  );
  addPlant(0.01, EForestPlants.ICE_FLOWER, 0, 3, ForestBiomes.FirefliesForest);

    ForestBiomes.FirefliesForest.addChunkStructure("eucalyptus_tree_0", 0.89, 3);
    ForestBiomes.FirefliesForest.addChunkStructure("pink_tree_0", 0.78, 2);

    ForestBiomes.FirefliesForest.addChunkStructure("eucalyptus_tree_0", 0.64, 3);
    ForestBiomes.FirefliesForest.addChunkStructure("pink_tree_0", 0.64, 2);


  ForestBiomes.FirefliesForest.addChunkStructure("electric_mushroom_tree_0", 0.01, 1);
  ForestBiomes.FirefliesForest.addChunkStructure("electric_mushroom_tree_1", 0.004, 1);
  ForestBiomes.FirefliesForest.addChunkStructure("big_mushroom_tree", 0.004, 1 );

  ForestBiomes.FirefliesForest.addChunkStructure("brown_mushroom_tree_0", 0.01, 1);
  ForestBiomes.FirefliesForest.addChunkStructure("brown_mushroom_tree_1", 0.008, 1);
  ForestBiomes.FirefliesForest.addChunkStructure("red_mushroom_tree", 0.01, 1 );

  ItemGeneration.newGenerator("if:ancient_fountain");


  ItemGeneration.addItem(
    "if:ancient_fountain",
    ItemID["lost_paper"],
    0.05,
    { min: 1, max: 2 },
    0
  );
  ItemGeneration.addItem(
    "if:ancient_fountain",
    ItemID["pink_stick"],
    0.35,
    { min: 1, max: 8 },
    0
  );
  ItemGeneration.addItem(
    "if:ancient_fountain",
    ItemID["eucalyptus_stick"],
    0.35,
    { min: 1, max: 8 },
    0
  );
  ItemGeneration.addItem("if:ancient_fountain", VanillaBlockID.web, 0.7, {
    min: 3,
    max: 10,
  });
  ItemGeneration.addItem(
    "if:ancient_fountain",
    VanillaItemID.string,
    0.4,
    { min: 1, max: 12 },
    0
  );
  ItemGeneration.addItem(
    "if:ancient_fountain",
    VanillaItemID.coal,
    0.6,
    { min: 1, max: 7 },
    0
  );

  ForestBiomes.FirefliesForest.addStructure("ancient_fountain", 1, 1, {
    after(x, y, z, region, packet) {
      Game.message("" + World.getBlockID(x, y + 8, z))
      ItemGeneration.fill(
        "if:ancient_fountain",
        x,
        y + 8,
        z,
        packet.random,
        region
      );
    },
  });
  
  ModAPI.addAPICallback("AncientWondersAPI", (api: {}) => {
    ItemGeneration.addItem(
      "if:ancient_fountain",
      ItemID.sroll6,
      0.05,
      { max: 1 },
      0
    );
    ItemGeneration.addItem(
      "if:ancient_fountain",
      ItemID.sroll4,
      0.05,
      { max: 1 },
      0
    );
    ItemGeneration.addItem(
      "if:ancient_fountain",
      ItemID.sroll9,
      0.05,
      { max: 1 },
      0
    );
    ItemGeneration.addItem(
      "if:ancient_fountain",
      ItemID.sroll1,
      0.03,
      { max: 1 },
      0
    );
    ItemGeneration.addItem(
      "if:ancient_fountain",
      ItemID.sroll2,
      0.03,
      { max: 1 },
      0
    );
    ItemGeneration.addItem(
      "if:ancient_fountain",
      ItemID.sroll3,
      0.03,
      { max: 1 },
      0
    );
    ItemGeneration.addItem(
      "if:ancient_fountain",
      ItemID.sroll7,
      0.02,
      { max: 1 },
      0
    );
    ItemGeneration.addItem(
      "if:ancient_fountain",
      ItemID.sroll5,
      0.02,
      { max: 1 },
      0
    );
  });
 }
