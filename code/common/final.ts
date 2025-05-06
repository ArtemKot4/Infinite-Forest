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
    function read(scope: typeof ObjectPlayer.list) {
        ObjectPlayer.list = scope ? scope : {};
    },
    function save() {
        return ObjectPlayer.list;
    }
);


// class TestBookItem extends BasicItem {
//     public book: TestBook = new TestBook("book.background", 1.95);
//     public onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
//         this.book.open();
//         return;
//     };
// };

// new TestBookItem("test_book_item", {
//     name: "forest_diary",
//     meta: 0
// }, {
//     stack: 1
// });

Callback.addCallback("ModsLoaded", () => {
    ItemList.ANCIENT_NOTE.setupAllToCreative();
});