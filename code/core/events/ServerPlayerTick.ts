Callback.addCallback("ServerPlayerTick", (playerUid: number) => {
    if(World.getThreadTime() % 8 === 0) {
        const player = new PlayerEntity(playerUid);

        const selectedItemStack = player.getInventorySlot(player.getSelectedSlot());
        const carriedItemStack = player.getCarriedItem();

        const handFunction = ItemForest.handFunctions.get(selectedItemStack.id);

        if (selectedItemStack.id == carriedItemStack.id && handFunction !== undefined) {
            return handFunction(selectedItemStack);
        };
    };

    if(Player.getDimension() !== InfiniteForest.id) {
        return;
    };

    const pos = Entity.getPosition(playerUid);
    const region = BlockSource.getDefaultForDimension(InfiniteForest.id);
    const biome = region.getBiome(pos.x, pos.z);

    const params = AbstractBiome.data[biome] as AbstractBiome & BiomeBehaviour;

    if(!params) {
        return;
    };

    const time = World.getThreadTime();

    if(params.getServerUpdate && time % params.getServerUpdate() == 0 && params.onServerTick) {
        return params.onServerTick(playerUid, region, pos.x, pos.y, pos.z, time);
    };
});
