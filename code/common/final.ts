Callback.addCallback("ItemUse", (coords, item, block, isE, player) => {
    // if(Entity.getSneaking(player)) {
    //     EffectList.WINTER.init(player);
    // };
});

Callback.addCallback("LevelDisplayed", () => {
    BookPage.loadFromJSON(__dir__ + "resources/assets/pages/");
});


ModAPI.addAPICallback("InfiniteDepth", function(InfiniteDepth) {
    InfiniteDepth.fromJson({
        [InfiniteForest.id]: {
             "min": 0,
             "max": 512
        }
    });
});

Callback.addCallback("LevelLeft", () => {
    ObjectPlayer.clearList();
    InventorySaver.clearList();
});

Saver.addSavesScope("scope.infinite_forest.inventory_saver", 
    function save(scope: { list: typeof InventorySaver.list }) {
        InventorySaver.list = scope && scope.list ? scope.list : {};
    },
    function read() {
        return { list: InventorySaver.list };
    }
);

Saver.addSavesScope("scope.infinite_forest.object_player_list", 
    function read(scope: { list: typeof ObjectPlayer.list }) {
        ObjectPlayer.list = scope && scope.list ? scope.list : {};
    },
    function save() {
        return { list: ObjectPlayer.list };
    }
);
