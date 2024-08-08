namespace ForestGeneration {
    addPlant(0.2, EForestPlants.FIRONIA, 0, 3, ForestBiomes.FirefliesForest);
    ItemGeneration.newGenerator("if:ancient_fountain");
    for(let i = 0; i <= 1; i++) {
    ForestBiomes.FirefliesForest.loadStructure("eucalyptus_tree_"+i);
    ForestBiomes.FirefliesForest.loadStructure("pink_tree_"+i);
    };
    ForestBiomes.FirefliesForest.addStructure("ancient_fountain", 1, 1, {
        after(x, y, z, region, packet) {
            ItemGeneration.fill("if:ancient_fountain", x, y+1, z, packet.random, region);
        },
    });
    ItemGeneration.addItem("if:ancient_fountain", ItemID["lost_paper"], 0.05, {min: 1, max: 2}, 0);
    ItemGeneration.addItem("if:ancient_fountain", ItemID["pink_stick"], 0.35, {min: 1, max: 8}, 0);
    ItemGeneration.addItem("if:ancient_fountain", ItemID["eucalyptus_stick"], 0.35, {min: 1, max: 8}, 0);
    ItemGeneration.addItem("if:ancient_fountain", VanillaBlockID.web, 0.7, {min: 3, max: 10});
    ItemGeneration.addItem("if:ancient_fountain", VanillaItemID.string, .4, {min: 1, max: 12}, 0);
    ItemGeneration.addItem("if:ancient_fountain", VanillaItemID.coal, .6, {min: 1, max: 7}, 0);

    ModAPI.addAPICallback("AncientWondersAPI", (api: {}) => {
        ItemGeneration.addItem("if:ancient_fountain", ItemID.sroll6, .05, {max: 1}, 0);
        ItemGeneration.addItem("if:ancient_fountain", ItemID.sroll4, .05, {max: 1}, 0);
        ItemGeneration.addItem("if:ancient_fountain", ItemID.sroll9, .05, {max: 1}, 0);
        ItemGeneration.addItem("if:ancient_fountain", ItemID.sroll1, .03, {max: 1}, 0);
        ItemGeneration.addItem("if:ancient_fountain", ItemID.sroll2, .03, {max: 1}, 0);
        ItemGeneration.addItem("if:ancient_fountain", ItemID.sroll3, .03, {max: 1}, 0);
        ItemGeneration.addItem("if:ancient_fountain", ItemID.sroll7, .02, {max: 1}, 0);
        ItemGeneration.addItem("if:ancient_fountain", ItemID.sroll5, .02, {max: 1}, 0);
    })
}