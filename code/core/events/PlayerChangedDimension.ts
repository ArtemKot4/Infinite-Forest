class InventorySaver {
    public static data: Record<string, ItemInstance[]> = {};

    public static replace(player: number) {
        const entity = new PlayerEntity(player);
        const name = Entity.getNameTag(player);
        const from = [];
        const to = this.data[name] ??= [];

        for(let i = 0; i < 36; i++) {
            from.push(entity.getInventorySlot(i));
            entity.setInventorySlot(i, new ItemStack());
        };

        for(const instance of to) {
            entity.addItemToInventory(instance);
        };

        this.data[name] = from;
    };

    static {
        Saver.addSavesScope("scope.infinite_forest.inventory_saver", 
            function load(scope: {data: Record<string, ItemInstance[]>}) {
                InventorySaver.data = scope ? scope.data : {}
            },
            function read() {
                return {data: InventorySaver.data};
            }
        );
    }
}

Callback.addCallback("PlayerChangedDimension", function (playerUid: number, from: number, to: number) {
    if (Entity.getDimension(playerUid) == InfiniteForest.id) {
        World.setWorldTime(42000);

        Commands.exec("/gamerule doDaylightCycle false");
        Commands.exec("/gamerule doWeatherCycle false");

        InventorySaver.replace(playerUid);
        
        Book.givePageFor(playerUid, "default", "infinite_forest_is_real");
    } else {
        Commands.exec("/gamerule doDaylightCycle true");
        Commands.exec("/gamerule doWeatherCycle true");
        
        if(from == InfiniteForest.id) {
            InventorySaver.replace(playerUid);
        };
    };
});
  