Callback.addCallback("ServerPlayerTick", (playerUid: number) => {
    if(Entity.getDimension(playerUid) !== EDimension.INFINITE_FOREST.id) {
        return;
    };
    const pos = Entity.getPosition(playerUid);
    const time = World.getThreadTime();
    const region = BlockSource.getDefaultForDimension(EDimension.INFINITE_FOREST.id);
    const biome = region.getBiome(pos.x, pos.z);
    const params = AbstractBiome.data[biome] as AbstractBiome & BiomeBehaviour;

    if(!params) {
        return;
    };

    if(time % 20 === 0) {
        if(Curse.has("cold") && params.getBiomeState() !== EBiomeState.COLD && pos.y >= 200) {
            if(time % 40 === 0) {
                Effect.get("winter").init(playerUid, pos.y / 6);
            };
            BiomeList.WINTER_FOREST.runSnowInRadius(pos.x, pos.y + 12.5, pos.z, 64, 24);
        }
        if(Curse.has("cursed_lightning") && pos.y <= FearEffect.HEIGHT) {
            Effect.get("fear").init(playerUid, 80, 250 - (10 * (pos.y / 10)));
        }
    };
    
    if(params.getServerUpdate && time % params.getServerUpdate() == 0 && params.insideServerTick) {
        return params.insideServerTick(playerUid, region, pos.x, pos.y, pos.z, time);
    };
});
