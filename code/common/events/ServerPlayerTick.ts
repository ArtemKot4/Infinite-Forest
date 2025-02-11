Callback.addCallback("ServerPlayerTick", (playerUid: number) => {
    if(World.getThreadTime() % 8 === 0) {
        const entity = new PlayerEntity(playerUid);

        const selectedItemStack = entity.getInventorySlot(entity.getSelectedSlot());
        const carriedItemStack = entity.getCarriedItem();

        const handFunction = ItemForest.handFunctions.get(selectedItemStack.id);

        if (selectedItemStack.id == carriedItemStack.id && handFunction !== undefined) {
            return handFunction(selectedItemStack, playerUid);
        };
    };

    if(Player.getDimension() !== InfiniteForest.id) {
        return;
    };

    const pos = Entity.getPosition(playerUid);

    const time = World.getThreadTime();

    const region = BlockSource.getDefaultForDimension(InfiniteForest.id);
    const biome = region.getBiome(pos.x, pos.z);

    const params = AbstractBiome.data[biome] as AbstractBiome & BiomeBehaviour;

    if(!params) {
        return;
    };

    if(time % 20 === 0 && Curse.has("cold") && params.getBiomeState() !== EBiomeState.COLD && pos.y >= 200) {
        
        if(time % 40 === 0) {
            EffectList.WINTER.init(playerUid, pos.y / 6);
        };

        BiomeList.WINTER_FOREST.runSnowInRadius(pos.x, pos.y + 12.5, pos.z, 64, 24);
    };
    
    if(params.getServerUpdate && time % params.getServerUpdate() == 0 && params.insideServerTick) {
        return params.insideServerTick(playerUid, region, pos.x, pos.y, pos.z, time);
    };
});
