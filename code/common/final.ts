Callback.addCallback("ItemUse", (coords, item, block, isE, player) => {
    // if(Entity.getSneaking(player)) {
    //     EffectList.WINTER.init(player);
    // };
});

Callback.addCallback("LevelDisplayed", () => {
    //BookPage.loadFromJSON(__dir__ + "resources/assets/pages/");
});


ModAPI.addAPICallback("InfiniteDepth", function(InfiniteDepth) {
    InfiniteDepth.fromJson({
        [EDimension.INFINITE_FOREST.id]: {
             "min": 0,
             "max": 512
        }
    });
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
    function read(scope: typeof ObjectPlayer.list) {
        ObjectPlayer.list = scope ? scope : {};
    },
    function save() {
        return ObjectPlayer.list;
    }
);

Saver.addSavesScope("scope.infinite_forest.data", 
    function read(scope) {
        scope = scope ? scope : {}
    },  
    function save() {
        return InfiniteForest.data || {
            vinePos: [],
            dungeons: new Map()
        }
    }
);

Callback.addCallback("LevelLeft", () => {
    ObjectPlayer.clearList();
    InventorySaver.clearList();

    InfiniteForest.data.vinePos = [];
    InfiniteForest.data.dungeons = new Map();
});

// Callback.addCallback("ModsLoaded", () => {
//     ItemList.ANCIENT_NOTE.setupAllToCreative();
// });
