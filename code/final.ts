Callback.addCallback("ItemUse", (coords, item, block, isE, player) => {
    // if(Entity.getSneaking(player)) {
    //     EffectList.WINTER.init(player);
    // };
});

Callback.addCallback("LevelDisplayed", () => {
    BookPage.loadFromJSON(__dir__ + "resources/assets/pages/");
    ItemList.ANCIENT_NOTE.setupAllToCreative();
});


ModAPI.addAPICallback("InfiniteDepth", function(InfiniteDepth) {
    InfiniteDepth.fromJson({
        [InfiniteForest.id]: {
             "min": 0,
             "max": 512
        }
    });
});


