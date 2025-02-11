class InventorySaver {
    public static list: Record<number, ItemInstance[]> = {};

    public static replaceFor(player: number) {
        this.list ??= {};
        
        const entity = new PlayerEntity(player);
        const from = [];
        const to = this.list[player] ??= [];

        for(let i = 0; i < 36; i++) {
            from.push(entity.getInventorySlot(i));
            entity.setInventorySlot(i, new ItemStack());
        };

        for(const instance of to) {
            entity.addItemToInventory(instance);
        };

        this.list[player] = from;
    };

    public static clearList(): void {
        this.list = {};
    };
};



Callback.addCallback("PlayerChangedDimension", function (playerUid: number, from: number, to: number) {
    if (Entity.getDimension(playerUid) == InfiniteForest.id) {
        World.setWorldTime(42000);

        Commands.exec("/gamerule doDaylightCycle false");
        Commands.exec("/gamerule doWeatherCycle false");

        if(from !== InfiniteForest.id) {
            InventorySaver.replaceFor(playerUid);
        };
        
        ObjectPlayer.addLearning(playerUid, "first_point");
    } else {
        Commands.exec("/gamerule doDaylightCycle true");
        Commands.exec("/gamerule doWeatherCycle true");
        
        if(from == InfiniteForest.id) {
            InventorySaver.replaceFor(playerUid);
        };
    };
});
  